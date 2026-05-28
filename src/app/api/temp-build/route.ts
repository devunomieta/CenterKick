import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'build';

  try {
    let output = '';
    if (action === 'lint') {
      output = execSync('npx eslint .', { encoding: 'utf-8' });
    } else {
      output = execSync('npm run build', { encoding: 'utf-8' });
    }
    return NextResponse.json({ success: true, output });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message, 
      stdout: err.stdout?.toString(), 
      stderr: err.stderr?.toString() 
    });
  }
}
