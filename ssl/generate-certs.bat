@echo off
echo Generating self-signed SSL certificates for development...

openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo SSL certificates generated successfully!
echo cert.pem - Certificate file
echo key.pem - Private key file

pause