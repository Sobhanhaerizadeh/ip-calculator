from fastapi import APIRouter , Request
router =APIRouter()
@router.post("/subnet")
def subnet():
    return{
  "message": "Subnet endpoint works"
}