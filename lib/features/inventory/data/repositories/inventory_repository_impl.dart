import 'package:hive/hive.dart';
import 'package:inventory_app/core/constants/app_constants.dart';
import 'package:inventory_app/features/inventory/data/models/item_model.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';
import 'package:inventory_app/features/inventory/domain/repositories/inventory_repository.dart';

class InventoryRepositoryImpl implements InventoryRepository {
  final Box<ItemModel> _box;

  InventoryRepositoryImpl(this._box);

  @override
  Future<List<Item>> getItems() async {
    return _box.values.map((e) => e.toEntity()).toList();
  }

  @override
  Future<void> addItem(Item item) async {
    final model = ItemModel.fromEntity(item);
    await _box.put(item.id, model);
  }

  @override
  Future<void> updateItem(Item item) async {
    // Hive put updates if key exists
    await addItem(item);
  }

  @override
  Future<void> deleteItem(String id) async {
    await _box.delete(id);
  }

  @override
  Future<List<Item>> getShoppingList() async {
    final allItems = await getItems();
    return allItems.where((item) => 
      item.status == ItemStatus.needToBuy || 
      item.status == ItemStatus.low
    ).toList();
  }
}
