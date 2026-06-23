from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class IPRequest(BaseModel):
    ip: str


@router.post("/subnet")
def subnet(request: IPRequest):
    ip_only = request.ip.strip().split("/")[0];
    prefix = request.ip.strip().split("/")[1];
    octets = ip_only.split(".")

    if len(octets) != 4:
        return {"error": "Ungültige IP-Adresse"}

    if int(prefix) < 0 or int(prefix) > 32:
        return {"error" : "Ungültiges Präfix!"}  


    for octet in octets:
        if not octet.isdigit() or int(octet) < 0 or int(octet) > 255:
            return {"error" : "Ungültige IP-Adresse"}

    try:
        binary_octets = [format(int(octet), "08b") for octet in octets]
    except ValueError:
        return {"error": "Ungültige IP-Adresse"}
    
    prefix_binary = format(int(prefix), "08b")

    return {
        "ip": request.ip,
        "binary": ".".join(binary_octets),
        "prefix_binary": prefix_binary,
    }
