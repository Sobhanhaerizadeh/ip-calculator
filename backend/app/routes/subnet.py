from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class IPRequest(BaseModel):
    ip: str


@router.post("/subnet")
def subnet(request: IPRequest):
    ip_only = request.ip.strip().split("/")[0];
    octets = ip_only.split(".")

    if len(octets) != 4:
        return {"error": "Ungültige IP-Adresse"}

    for octet in octets:
        if not octet.isdigit() or int(octet) < 0 or int(octet) > 255:
            return {"error" : "Ungültige IP-Adresse"}

    try:
        binary_octets = [format(int(octet), "08b") for octet in octets]
    except ValueError:
        return {"error": "Ungültige IP-Adresse"}

    return {
        "ip": request.ip,
        "binary": ".".join(binary_octets),
    }
