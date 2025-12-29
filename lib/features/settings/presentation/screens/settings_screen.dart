import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:inventory_app/features/inventory/presentation/providers/inventory_provider.dart';
import 'package:inventory_app/core/services/update_service.dart';
import 'package:inventory_app/core/widgets/glass_container.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String _version = '1.0.0';
  String _buildNumber = '1';

  @override
  void initState() {
    super.initState();
    _loadPackageInfo();
  }

  Future<void> _loadPackageInfo() async {
    final packageInfo = await PackageInfo.fromPlatform();
    setState(() {
      _version = packageInfo.version;
      _buildNumber = packageInfo.buildNumber;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.only(top: 100, left: 16, right: 16, bottom: 20),
      children: [
        const Text(
          'Settings',
          style: TextStyle(
            color: Colors.white,
            fontSize: 32,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Manage your app settings and data',
          style: TextStyle(color: Colors.white70, fontSize: 14),
        ),
        const SizedBox(height: 30),
        _buildSectionTitle('App Info'),
        _buildSettingsTile(
          icon: Icons.info_outline,
          title: 'Version',
          subtitle: '$_version ($_buildNumber)',
          onTap: null,
        ),
        _buildSettingsTile(
          icon: Icons.system_update,
          title: 'Check for Updates',
          subtitle: 'Manually check for a new version',
          onTap: () {
            UpdateService().checkForUpdate(context, silent: false);
          },
        ),
        const SizedBox(height: 20),
        _buildSectionTitle('Preferences'),
        _buildSettingsTile(
          icon: Icons.language,
          title: 'Language',
          subtitle: 'English / Arabic',
          onTap: () {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Multi-language coming soon!')),
            );
          },
        ),
        const SizedBox(height: 20),
        _buildSectionTitle('Data Management'),
        _buildSettingsTile(
          icon: Icons.delete_forever,
          title: 'Reset All Data',
          subtitle: 'Clear all items and settings',
          isDestructive: true,
          onTap: () => _showResetConfirmation(context),
        ),
        const SizedBox(height: 50),
        Center(
          child: Text(
            'Version $_version',
            style: const TextStyle(color: Colors.white38, fontSize: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
      child: Text(
        title.toUpperCase(),
        style: const TextStyle(
          color: Color(0xFF006C5B),
          fontSize: 12,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.1,
        ),
      ),
    );
  }

  Widget _buildSettingsTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required VoidCallback? onTap,
    bool isDestructive = false,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: GlassContainer(
        opacity: 0.1,
        blur: 10,
        child: ListTile(
          onTap: onTap,
          leading: Icon(icon,
              color: isDestructive ? Colors.redAccent : Colors.white70),
          title: Text(
            title,
            style: TextStyle(
              color: isDestructive ? Colors.redAccent : Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
          subtitle: Text(
            subtitle,
            style: const TextStyle(color: Colors.white38, fontSize: 12),
          ),
          trailing: onTap != null
              ? const Icon(Icons.chevron_right, color: Colors.white24)
              : null,
        ),
      ),
    );
  }

  void _showResetConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: GlassContainer(
          opacity: 0.2,
          blur: 15,
          borderRadius: BorderRadius.circular(20),
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.warning_amber_rounded,
                  color: Colors.redAccent, size: 50),
              const SizedBox(height: 16),
              const Text(
                'Are you sure?',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              const Text(
                'This will permanently delete all your inventory data and reset to defaults.',
                style: TextStyle(color: Colors.white70, fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Cancel',
                        style: TextStyle(color: Colors.white60)),
                  ),
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.redAccent,
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      ref.read(inventoryProvider.notifier).resetData();
                      Navigator.pop(context);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Data reset successfully')),
                      );
                    },
                    child: const Text('Reset Data'),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}
