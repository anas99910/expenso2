import 'package:hive/hive.dart';
import 'package:inventory_app/features/inventory/domain/entities/item.dart';

part 'item_model.g.dart';

@HiveType(typeId: 0)
class ItemModel extends HiveObject {
  @HiveField(0)
  final String id;

  @HiveField(1)
  final String name;

  @HiveField(2)
  final String category;

  @HiveField(3)
  final double quantity;

  @HiveField(4)
  final String unit;

  @HiveField(5)
  final String status; // Stored as String for simplicity

  @HiveField(6)
  final String? location;

  @HiveField(7)
  final bool isBought;

  ItemModel({
    required this.id,
    required this.name,
    required this.category,
    required this.quantity,
    required this.unit,
    required this.status,
    this.location,
    required this.isBought,
  });

  // Mapper to Entity
  Item toEntity() {
    return Item(
      id: id,
      name: name,
      category: category,
      quantity: quantity,
      unit: unit,
      status: ItemStatus.values.firstWhere(
        (e) => e.toString().split('.').last == status,
        orElse: () => ItemStatus.available,
      ),
      location: location,
      isBought: isBought,
    );
  }

  // Mapper from Entity
  factory ItemModel.fromEntity(Item item) {
    return ItemModel(
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      status: item.status.toString().split('.').last,
      location: item.location,
      isBought: item.isBought,
    );
  }
}
