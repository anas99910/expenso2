import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:inventory_app/features/inventory/presentation/screens/inventory_screen.dart';
import 'package:inventory_app/features/shopping_list/presentation/screens/shopping_list_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    InventoryScreen(),
    ShoppingListScreen(),
    Center(child: Text('Categories - Coming Soon')),
  ];

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 1. Global Background
        Positioned.fill(
          child: Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Color(0xFF00332C), // Very dark green
                  Color(0xFF000000), // Black
                  Color(0xFF004D40), // Dark Teal
                ],
              ),
            ),
          ),
        ),
        // 2. Main App Content
        Scaffold(
          backgroundColor: Colors.transparent,
          extendBodyBehindAppBar: true,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            flexibleSpace: ClipRect(
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
                child: const SizedBox.expand(),
              ),
            ),
            title: const Text('بيت الخزين',
                style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    fontFamily: 'Outfit')),
            iconTheme: const IconThemeData(color: Colors.white),
          ),
          body: IndexedStack(
            index: _currentIndex,
            children: _screens,
          ),
          bottomNavigationBar: NavigationBar(
            backgroundColor: Colors.black.withOpacity(0.4),
            indicatorColor: const Color(0xFF006C5B),
            selectedIndex: _currentIndex,
            onDestinationSelected: (index) =>
                setState(() => _currentIndex = index),
            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.inventory_2_outlined, color: Colors.white70),
                selectedIcon: Icon(Icons.inventory_2, color: Colors.white),
                label: 'Inventory',
              ),
              NavigationDestination(
                icon: Icon(Icons.shopping_cart_outlined, color: Colors.white70),
                selectedIcon: Icon(Icons.shopping_cart, color: Colors.white),
                label: 'Shopping',
              ),
              NavigationDestination(
                icon: Icon(Icons.category_outlined, color: Colors.white70),
                selectedIcon: Icon(Icons.category, color: Colors.white),
                label: 'Categories',
              ),
            ],
          ),
        ),
      ],
    );
  }
}
