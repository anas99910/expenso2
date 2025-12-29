import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:pub_semver/pub_semver.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:inventory_app/core/widgets/glass_container.dart';

class UpdateService {
  // Configured for the user's specific repository
  final String repoOwner = 'anas99910';
  final String repoName = 'expenso2';

  Future<void> checkForUpdate(BuildContext context,
      {bool silent = false}) async {
    try {
      final packageInfo = await PackageInfo.fromPlatform();
      final currentVersion = Version.parse(packageInfo.version);

      debugPrint('Checking for updates... Current version: $currentVersion');

      final response = await http.get(Uri.parse(
          'https://api.github.com/repos/$repoOwner/$repoName/releases/latest'));

      if (response.statusCode == 200) {
        final latestRelease = jsonDecode(response.body);
        final tagName = latestRelease['tag_name'] as String;

        // Remove 'v' prefix if present for parsing
        final cleanTag = tagName.replaceAll('v', '');

        try {
          final latestVersion = Version.parse(cleanTag);
          debugPrint('Latest version on GitHub: $latestVersion');

          if (latestVersion > currentVersion) {
            if (context.mounted) {
              _showUpdateDialog(
                  context, latestRelease, currentVersion.toString());
            }
          } else {
            debugPrint('App is up to date.');
            if (!silent && context.mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('You are on the latest version'),
                  backgroundColor: Color(0xFF006C5B),
                ),
              );
            }
          }
        } catch (e) {
          debugPrint('Error parsing version: $e');
        }
      } else {
        debugPrint('Failed to fetch releases. Status: ${response.statusCode}');
        if (!silent && context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Failed to check for updates (Status: ${response.statusCode})'),
              backgroundColor: Colors.redAccent,
            ),
          );
        }
      }
    } catch (e) {
      debugPrint('Error checking for updates: $e');
      if (!silent && context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to check for updates. Check internet.'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  void _showUpdateDialog(BuildContext context, Map<String, dynamic> release,
      String currentVersion) {
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
              const Icon(Icons.system_update, color: Colors.white, size: 50),
              const SizedBox(height: 16),
              const Text(
                'New Update Available! 🚀',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 10),
              Text(
                'Version ${release['tag_name']} is now available.\nYou are currently on $currentVersion.',
                style: const TextStyle(color: Colors.white70, fontSize: 14),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 20),
              if (release['body'] != null)
                Container(
                  constraints: const BoxConstraints(maxHeight: 200),
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.black26,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: SingleChildScrollView(
                    child: Text(
                      release['body'],
                      style:
                          const TextStyle(color: Colors.white60, fontSize: 12),
                    ),
                  ),
                ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  TextButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Later',
                        style: TextStyle(color: Colors.white60)),
                  ),
                  FilledButton(
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF006C5B),
                      foregroundColor: Colors.white,
                    ),
                    onPressed: () {
                      final url = release['html_url'];
                      launchUrl(Uri.parse(url),
                          mode: LaunchMode.externalApplication);
                    },
                    child: const Text('Update Now'),
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
