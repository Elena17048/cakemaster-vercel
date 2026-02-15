export async function POST(req: Request) {
  try {
    const order = await req.json();

    // odstraní všechny undefined hodnoty
    const cleanedOrder = Object.fromEntries(
      Object.entries(order).filter(([_, value]) => value !== undefined)
    );

    const docRef = await adminDb.collection("orders").add({
      ...cleanedOrder,
      status: "new",
      createdAt: new Date(),
    });

    return NextResponse.json({
      orderId: docRef.id,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Firestore error" }, { status: 500 });
  }
}
