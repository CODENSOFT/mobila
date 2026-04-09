import { isValidObjectId } from "mongoose";

import { connectDB } from "../../../../lib/db";
import Client from "../../../../models/Client";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID invalid." }, { status: 400 });
    }

    await connectDB();
    const deletedClient = await Client.findByIdAndDelete(id);

    if (!deletedClient) {
      return Response.json({ message: "Clientul nu a fost gasit." }, { status: 404 });
    }

    return Response.json({ message: "Client sters cu succes." }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/clienti/:id error:", error);
    return Response.json({ message: "Nu s-a putut sterge clientul." }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return Response.json({ message: "ID invalid." }, { status: 400 });
    }

    const body = await request.json();
    const status = body?.status;
    const allowedStatuses = ["new", "contacted", "closed"];

    if (!allowedStatuses.includes(status)) {
      return Response.json({ message: "Status invalid." }, { status: 400 });
    }

    await connectDB();
    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updatedClient) {
      return Response.json({ message: "Clientul nu a fost gasit." }, { status: 404 });
    }

    return Response.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/clienti/:id error:", error);
    return Response.json(
      { message: "Nu s-a putut actualiza statusul clientului." },
      { status: 500 }
    );
  }
}
