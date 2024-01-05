export class JsonResponse extends Response {
  constructor(body: any, init?: ResponseInit) {
    super(JSON.stringify(body), {
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      ...init,
    });
  }
}

export class ErrorResponse extends JsonResponse {
  constructor(message: string, status = 400) {
    super({ error: message }, { status });
  }
}
