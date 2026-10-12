// POST /api/auth/logout
// Clears the Clerk session cookie

export async function POST(request: Request) {
  try {
    // Clear the Clerk session cookie
    // Clerk uses __session cookie
    const response = new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': '__session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
        },
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error in POST /api/auth/logout:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}