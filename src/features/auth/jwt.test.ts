import { describe, expect, it } from 'vitest';
import { decodeJwtRoles, parseJwt } from './jwt';

describe('parseJwt', () => {
  it('decodes HS512 JWT payload (BASE64URL)', () => {
    // eyJ0eXBlIjoiQUNDRVNTIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9CVVlFUiJdLCJzdWIiOiJ1QGUuY29tIn0
    // = {"type":"ACCESS","authorities":["ROLE_BUYER"],"sub":"u@e.com"}
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiQUNDRVNTIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9CVVlFUiJdLCJzdWIiOiJ1QGUuY29tIn0.signature';
    const payload = parseJwt(token);
    expect(payload.type).toBe('ACCESS');
    expect(payload.authorities).toEqual(['ROLE_BUYER']);
    expect(payload.sub).toBe('u@e.com');
  });

  it('returns empty object for malformed token', () => {
    const payload = parseJwt('not-a-jwt');
    expect(payload).toEqual({});
  });
});

describe('decodeJwtRoles', () => {
  it('extracts BUYER role from authorities', () => {
    // payload: {"type":"ACCESS","authorities":["ROLE_BUYER"]}
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiQUNDRVNTIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9CVVlFUiJdfQ.signature';
    expect(decodeJwtRoles(token)).toEqual(['BUYER']);
  });

  it('extracts SELLER role', () => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiQUNDRVNTIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9TRUxMRVIiXX0.signature';
    expect(decodeJwtRoles(token)).toEqual(['SELLER']);
  });

  it('extracts ADMIN role', () => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiQUNDRVNTIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdfQ.signature';
    expect(decodeJwtRoles(token)).toEqual(['ADMIN']);
  });

  it('returns empty array when no authorities', () => {
    const token =
      'eyJhbGciOiJIUzUxMiJ9.eyJ0eXBlIjoiQUNDRVNTIiwiYXV0aG9yaXRpZXMiOltdfQ.signature';
    expect(decodeJwtRoles(token)).toEqual([]);
  });

  it('returns empty array on malformed token', () => {
    expect(decodeJwtRoles('garbage')).toEqual([]);
  });
});
