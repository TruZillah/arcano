from auth import verify_token
from fastapi import APIRouter, Header, Request
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get('/admin/status')
async def get_status(request: Request, authorization: str = Header(None)):
    # Validate Firebase ID token
    if not authorization or not authorization.startswith('Bearer '):
        return JSONResponse({'error': 'Missing or invalid Authorization header'}, status_code=401)
    token = authorization.split()[1]
    try:
        user = verify_token(token)
        # TODO: Check if user has admin privileges
        uid = user['uid']
    except Exception as e:
        return JSONResponse({'error': str(e)}, status_code=403)

    # TODO: Implement actual status check
    return JSONResponse({
        'status': 'running',
        'uptime': '0:00:00',
        'active_users': 0
    }) 