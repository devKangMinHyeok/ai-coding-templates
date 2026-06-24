// 도메인이 의도적으로 던지는 에러. 인터페이스 레이어(라우트)가 잡아 사용자 메시지로 바꾼다.
export class ValidationError extends Error {}
