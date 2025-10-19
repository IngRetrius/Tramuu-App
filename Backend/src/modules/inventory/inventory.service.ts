import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '@database/supabase.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';
import { CreateInventoryMovementDto } from './dto/create-inventory-movement.dto';

@Injectable()
export class InventoryService {
  constructor(private supabaseService: SupabaseService) {}

  async createItem(companyId: string, employeeId: string, dto: CreateInventoryItemDto) {
    const supabase = this.supabaseService.getClient();

    // Check if batch_id already exists for this company
    const { data: existing } = await supabase
      .from('inventory')
      .select('id')
      .eq('company_id', companyId)
      .eq('batch_id', dto.batchId)
      .single();

    if (existing) {
      throw new BadRequestException('El ID de lote ya existe');
    }

    const { data: item, error } = await supabase
      .from('inventory')
      .insert({
        company_id: companyId,
        batch_id: dto.batchId,
        quantity: dto.quantity,
        category: dto.category,
        status: dto.status,
        milking_id: dto.milkingId,
        notes: dto.notes,
        created_by: employeeId,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear item de inventario');

    return item;
  }

  async findAll(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: items, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException('Error al obtener inventario');

    return items || [];
  }

  async findOne(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: item, error } = await supabase
      .from('inventory')
      .select('*, milkings(id, shift, milking_date), employees(name)')
      .eq('id', id)
      .eq('company_id', companyId)
      .single();

    if (error || !item) {
      throw new NotFoundException('Item de inventario no encontrado');
    }

    return item;
  }

  async update(id: string, companyId: string, dto: UpdateInventoryItemDto) {
    const supabase = this.supabaseService.getClient();

    const { data: item, error } = await supabase
      .from('inventory')
      .update(dto)
      .eq('id', id)
      .eq('company_id', companyId)
      .select()
      .single();

    if (error) {
      throw new NotFoundException('Item de inventario no encontrado');
    }

    return item;
  }

  async remove(id: string, companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)
      .eq('company_id', companyId);

    if (error) throw new NotFoundException('Item de inventario no encontrado');

    return { message: 'Item eliminado exitosamente' };
  }

  async getStats(companyId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: items } = await supabase
      .from('inventory')
      .select('*')
      .eq('company_id', companyId);

    if (!items || items.length === 0) {
      return {
        totalLiters: 0,
        coldLiters: 0,
        hotLiters: 0,
        byCategory: {
          FRESH_MILK: 0,
          PROCESSING: 0,
          STORED: 0,
        },
        lowStockItems: [],
      };
    }

    const totalLiters = items.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const coldLiters = items
      .filter((item) => item.status === 'COLD')
      .reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);
    const hotLiters = items
      .filter((item) => item.status === 'HOT')
      .reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0);

    const byCategory = items.reduce((acc, item) => {
      const category = item.category || 'FRESH_MILK';
      acc[category] = (acc[category] || 0) + (parseFloat(item.quantity) || 0);
      return acc;
    }, {});

    // Items with less than 1000 liters
    const lowStockItems = items
      .filter((item) => parseFloat(item.quantity) < 1000)
      .map((item) => ({
        id: item.id,
        batchId: item.batch_id,
        quantity: item.quantity,
        category: item.category,
      }));

    return {
      totalLiters: Math.round(totalLiters),
      coldLiters: Math.round(coldLiters),
      hotLiters: Math.round(hotLiters),
      byCategory,
      lowStockItems,
    };
  }

  // Inventory Movements
  async createMovement(companyId: string, employeeId: string, dto: CreateInventoryMovementDto) {
    const supabase = this.supabaseService.getClient();

    // Verify inventory item exists and belongs to company
    const { data: item } = await supabase
      .from('inventory')
      .select('id, quantity')
      .eq('id', dto.inventoryItemId)
      .eq('company_id', companyId)
      .single();

    if (!item) {
      throw new NotFoundException('Item de inventario no encontrado');
    }

    // Validate quantity for OUT movements
    if (dto.type === 'OUT' && parseFloat(item.quantity) < dto.quantity) {
      throw new BadRequestException('Cantidad insuficiente en inventario');
    }

    // Create movement
    const { data: movement, error } = await supabase
      .from('inventory_movements')
      .insert({
        company_id: companyId,
        inventory_item_id: dto.inventoryItemId,
        type: dto.type,
        quantity: dto.quantity,
        reason: dto.reason,
        notes: dto.notes,
        created_by: employeeId,
      })
      .select()
      .single();

    if (error) throw new BadRequestException('Error al crear movimiento');

    // Update inventory quantity
    let newQuantity = parseFloat(item.quantity);
    if (dto.type === 'IN') {
      newQuantity += dto.quantity;
    } else if (dto.type === 'OUT') {
      newQuantity -= dto.quantity;
    } else if (dto.type === 'ADJUSTMENT') {
      newQuantity = dto.quantity;
    }

    await supabase
      .from('inventory')
      .update({ quantity: newQuantity })
      .eq('id', dto.inventoryItemId);

    return movement;
  }

  async getMovements(companyId: string, inventoryItemId?: string) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('inventory_movements')
      .select('*, inventory(batch_id), employees(name)')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (inventoryItemId) {
      query = query.eq('inventory_item_id', inventoryItemId);
    }

    const { data: movements, error } = await query;

    if (error) throw new BadRequestException('Error al obtener movimientos');

    return movements || [];
  }
}
