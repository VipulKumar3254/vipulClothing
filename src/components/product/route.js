import { adminDb } from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const order = searchParams.get("order") || "asc";
    const limit = Number(searchParams.get("limit") || 8);
    const cursor = searchParams.get("cursor");
    const lt = searchParams.get("lt");
    const search = searchParams.get("search");

    let ref = adminDb.collection("products");

    if (category) ref = ref.where("category", "array-contains", category);
    if (lt) ref = ref.where("price", "<", Number(lt));
    if (search) ref = ref.where("title", ">=", search).where("title", "<=", search + "\uf8ff");

    ref = ref.orderBy("price", order).limit(limit);

    if (cursor) {
      const snap = await adminDb.collection("products").doc(cursor).get();
      if (snap.exists) ref = ref.startAfter(snap);
    }

    const snap = await ref.get();

    return NextResponse.json({
      products: snap.docs.map(d => ({ id: d.id, ...d.data() })),
      lastCursor: snap.docs.at(-1)?.id || null,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
