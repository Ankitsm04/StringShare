from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for now (dev only)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (NO DB for now)
rooms = {}
connections = {}

@app.get("/")
def home():
    return {"message": "Code Share Backend Running 🚀"}


# Create Room
@app.post("/create-room")
def create_room():
    room_id = str(uuid4())[:6]   # short id
    rooms[room_id] = {
        "code": "",
    }
    return {"room_id": room_id}


@app.get("/room/{room_id}")
def get_room(room_id: str):

    # ✅ CREATE IF NOT EXISTS
    if room_id not in rooms:
        rooms[room_id] = {"code": ""}

    return rooms[room_id]

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):

    await websocket.accept()

    # ✅ CREATE ROOM IF NOT EXISTS
    if room_id not in rooms:
        rooms[room_id] = {"code": ""}

    if room_id not in connections:
        connections[room_id] = []

    connections[room_id].append(websocket)

    try:
        while True:
            data = await websocket.receive_text()

            rooms[room_id]["code"] = data

            for conn in connections[room_id]:
                await conn.send_text(data)

    except WebSocketDisconnect:
        if room_id in connections and websocket in connections[room_id]:
            connections[room_id].remove(websocket)