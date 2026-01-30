import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req, { params }) {
  try {
    const { id } =  await params;
    console.log("so the id is ",params)

    if (!id) {
      return Response.json({ error: "Missing id" }, { status: 400 });
    }

    const snap = await getDoc(doc(db, "products", id));

    if (!snap.exists()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({
      id: snap.id,
      ...snap.data(),
    });
  } catch (err) {
    console.error("PRODUCT API ERROR", err);
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
    