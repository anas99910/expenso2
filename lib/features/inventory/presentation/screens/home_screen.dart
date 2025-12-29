import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:inventory_app/features/inventory/presentation/screens/inventory_screen.dart';

import 'package:inventory_app/features/todo/presentation/screens/todo_list_screen.dart';
import 'package:inventory_app/features/settings/presentation/screens/settings_screen.dart';
import 'package:inventory_app/core/services/update_service.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    InventoryScreen(),
    ToDoListScreen(),
    SettingsScreen(),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      UpdateService().checkForUpdate(context, silent: true);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 1. Global Background
        Positioned.fill(
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: Theme.of(context).brightness == Brightness.dark
                    ? [
                        const Color(0xFF00332C), // Very dark green
                        const Color(0xFF000000), // Black
                        const Color(0xFF004D40), // Dark Teal
                      ]
                    : [
                        const Color(
                            0xFFD6E4E5), // Light Blue-Grey (from image background)
                        const Color(
                            0xFFFDFBF7), // Cream/Off-White (from cabinet)
                        const Color(0xFFFFFFFF), // White
                        const Color(0xFFB2DFDB), // Light Teal
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
            title: Text('بيت الخزين',
                style: TextStyle(
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white
                        : const Color(0xFF006C5B),
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    fontFamily: 'Outfit')),
            iconTheme: IconThemeData(
                color: Theme.of(context).brightness == Brightness.dark
                    ? Colors.white
                    : const Color(0xFF006C5B)),
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
            destinations: [
              NavigationDestination(
                icon: Icon(Icons.inventory_2_outlined,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white70
                        : Colors.black54),
                selectedIcon: Icon(Icons.inventory_2,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white
                        : Colors.black),
                label: 'Inventory',
              ),
              NavigationDestination(
                icon: Icon(Icons.checklist_rtl_rounded,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white70
                        : Colors.black54),
                selectedIcon: Icon(Icons.checklist_rtl,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white
                        : Colors.black),
                label: 'To-Do',
              ),
              NavigationDestination(
                icon: Icon(Icons.settings_outlined,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white70
                        : Colors.black54),
                selectedIcon: Icon(Icons.settings,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? Colors.white
                        : Colors.black),
                label: 'Settings',
              ),
            ],
          ),
        ),
      ],
    );
  }
}
