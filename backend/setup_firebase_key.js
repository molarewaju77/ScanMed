import fs from 'fs';
import path from 'path';

const content = {
    "type": "service_account",
    "project_id": "wave-5dfb4",
    "private_key_id": "a9f28f0e0adfd74d9028faa31fb2f38207f8a1f8",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCd8Gm1ryHNGNfv\nfsRktB8czcDanSVesFWVjWUvbBHuo1WfzgZ6DYUwMFcvnAGpU4Py2lrDfBKZiqDU\njjIIrCyorq+rsh3aY5sG88kxbGYm681QnpN50atiA+kHDQVpSKxAEptq7K7FwKjw\n4zvyxjRaZRZDLyqwQ4BDGJ2b3np0DDCA7SdJrK11ZhTE3Wxk4PUfNandzk5BZ8Kn\nhp5NY0NdMjUa6SHqpsyqaZorar3uNdSrDB9FZnZnceDG2pClfwb1ChGUpYALAMrv\n0j9IgeTX87z3Wo8/SVaCMhqBkuafkZlgUNPVsTGMb0GNu/HuN0fyDdnwtvM1oeDv\n+Tno9U7bAgMBAAECggEADCOHLGSad3X6WrjmhUrmvUL/GI5NafqpiUYFyeBHfIzn\nLtIZ41WYr/x3JvyZkBcQJCEuKqolj9F8zPlk1Q/OmuRaMhsNelR/fMhN5VOMgl9L\nN3AIq6s2veDJDzar/MyOGJqVgWFRiXdmRKViXSVorq3oSR+d61A00nNY4br2tGaA\nhAGMXxiE8vF6va0Dc08VfYOjJHQqx2dPfOJ0dIrLA2e6yXZVvq/rra4WZ+yRPIXb\n6/Uqtz1xvuEo+/piYKZ69LDne+79FShGntuJX+xZL4uouIZANFovCFUE/5wjQiOI\nxc/AeFWnDZYwZBI4L1puu2z1+t7SANAJgf1TsR65YQKBgQDOyTxzLDdIIFEe62Cu\n62oTxSKCNMoq9V8SuFRqvRsWj/rYpR8b+hxNidsBI9H5ArO1zkuX1v3vz1NbCrVO\nGzdsxEn5xBWr3sWRzEXG8WCucCH+tnlE1+CFatnyCRRBvd1EDzJsnbKSH+fUOOuA\nS66Tqa3TJWHYTOrWv32gnlIvSwKBgQDDhxlutSxpEd7zWe6HR6E6D1txp7rWhh8B\nJBtQOnqDZT5dd4LO8nBAvFgcNKDKjovoL2MhnD5KtQr2TYi0SEREmCIfmVfR7dop\nLGJTRC++HFqMLrzDFH702FHw1lwKKN5RfMz4D/1vIQsP51v+SU6Bq1hH24EtBWCs\neAAc5xpUsQKBgQCmQO8EHlGYALuX42CJYiaYHJABJZZBcaPtthvQ8ZeczUe99QwM\n/0rQIHze7sC7tqtsCZ+HRchGjWcUNIjOcl1eanabhEZ0N5ia/yQ+rgSwWuFKG8Vm\nTzZprh3qVdheftsuBBXjc+qFR3epjdXyAWcru2lQ8KY5NKY+4BiOEZw7/wKBgQC4\nQA3iOg3AcRu0G/HfPsuaR7B3GITC9J4w2BJ49rJOMVCkiSMV2nWXOySYZ6uBVPRX\n9pemq3Izugi7cvK4WEUkkmvNdRXBeC6VkAKTznRi5Jsa8EvmVOER3urQVV9kH4Do\nLv+DXqYGW4/uC6mvpOq63HkTNbCzeRbRTz9j/Q7d8QKBgQCQnARI8FqtaGf+e9Rj\n1jLIVdTjYuxyt/cNSE6b759mX4VqQ6KnVEA8EGZ1K6vzKkLEdFMSKCOaQEjUyl/w\nXPrw36+lUL/TPbxiQeKZrt3XV2T4wAJpgm3h6MR4FLjsyOZ2t4AXMzNVaw/saijD\ngiUhq91jA9JCCfdY0dqng86AYA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@wave-5dfb4.iam.gserviceaccount.com",
    "client_id": "110224126308726535731",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40wave-5dfb4.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};

const targetPath = path.join('firebase', 'serviceAccountKey.json');
fs.writeFileSync(targetPath, JSON.stringify(content, null, 2));
console.log(`Successfully wrote ${targetPath}`);
