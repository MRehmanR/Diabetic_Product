from fastapi.testclient import TestClient

from app.main import app


def test_forgot_password_route_returns_generic_message(monkeypatch):
    async def fake_request_password_reset(db, email):
        return {"message": "If that email exists, a password reset link has been sent."}

    monkeypatch.setattr("app.api.auth.request_password_reset", fake_request_password_reset)

    client = TestClient(app)
    response = client.post("/api/auth/forgot-password", json={"email": "admin@example.com"})

    assert response.status_code == 200
    assert response.json() == {
        "message": "If that email exists, a password reset link has been sent.",
        "reset_url": None,
    }


def test_reset_password_route_accepts_token(monkeypatch):
    async def fake_reset_password(db, token, password):
        assert token == "reset-token-value"
        assert password == "new-password"
        return {"message": "Password has been reset."}

    monkeypatch.setattr("app.api.auth.reset_password", fake_reset_password)

    client = TestClient(app)
    response = client.post(
        "/api/auth/reset-password",
        json={"token": "reset-token-value", "password": "new-password"},
    )

    assert response.status_code == 200
    assert response.json() == {"message": "Password has been reset.", "reset_url": None}
