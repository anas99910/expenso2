import 'package:equatable/equatable.dart';

enum ItemStatus { available, low, needToBuy }

class Item extends Equatable {
  final String id;
  final String name;
  final String category;
  final double quantity;
  final String unit;
  final ItemStatus status;
  final String? location;
  final bool isBought; // For shopping list check

  const Item({
    required this.id,
    required this.name,
    required this.category,
    this.quantity = 1.0,
    required this.unit,
    this.status = ItemStatus.available,
    this.location,
    this.isBought = false,
  });

  Item copyWith({
    String? id,
    String? name,
    String? category,
    double? quantity,
    String? unit,
    ItemStatus? status,
    String? location,
    bool? isBought,
  }) {
    return Item(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      quantity: quantity ?? this.quantity,
      unit: unit ?? this.unit,
      status: status ?? this.status,
      location: location ?? this.location,
      isBought: isBought ?? this.isBought,
    );
  }

  @override
  List<Object?> get props => [
        id,
        name,
        category,
        quantity,
        unit,
        status,
        location,
        isBought,
      ];
}
