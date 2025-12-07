/**
 * API Route: Discover vendors via web scraping
 */

import { NextRequest, NextResponse } from 'next/server';
import { vendorDiscoveryService } from '@/lib/services/vendor-discovery';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      part_description,
      technical_requirements,
      materials,
      processes,
      quantity,
      geographic_preference,
    } = body;

    if (!part_description) {
      return NextResponse.json(
        { error: 'part_description is required' },
        { status: 400 }
      );
    }

    // Discover vendors
    const vendors = await vendorDiscoveryService.discoverVendors({
      part_description,
      technical_requirements,
      materials,
      processes,
      quantity,
      geographic_preference,
    });

    // Save discovered vendors to database
    const savedVendorIds: string[] = [];
    for (const vendor of vendors) {
      const vendorId = await vendorDiscoveryService.saveDiscoveredVendor(vendor);
      if (vendorId) {
        savedVendorIds.push(vendorId);
      }
    }

    return NextResponse.json({
      success: true,
      vendors_discovered: vendors.length,
      vendors_saved: savedVendorIds.length,
      vendors: vendors.slice(0, 50), // Return first 50
    });
  } catch (error: any) {
    console.error('Vendor discovery error:', error);
    return NextResponse.json(
      { error: 'Failed to discover vendors', details: error.message },
      { status: 500 }
    );
  }
}

