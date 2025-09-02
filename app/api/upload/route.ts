// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'nationalid' or 'agreement'

    if (!file || !type) {
      return NextResponse.json(
        { error: 'File and type are required' }, 
        { status: 400 }
      );
    }

    // Validate file type - PDF only
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Please select a PDF file' }, 
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' }, 
        { status: 400 }
      );
    }

    const bucketName = "CBS";
    const filePath = `${Date.now()}-${type}-${file.name}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file);

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message }, 
        { status: 500 }
      );
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return NextResponse.json({ 
      success: true, 
      url: publicUrlData.publicUrl,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}