const enum AppErrorCode {
  InvalidAccessToken = "InvalidAccessToken",
  UserNotFound = "USER_NOT_FOUND",
  InvalidUser = "INVALID_USER",
  InvalidRole = "ROLE_INVALID",
  InvalidPayload = "INVALID_PAYLOAD",
  InvalidInput = "INVALID_INPUT",
  InvalidTicketId = "INVALID_TICKET_ID",
  InvalidTransactionId = "INVALID_TRANSACTION_ID",
  TicketNotFound = "TICKET_NOT_FOUND",
  NotEnoughStock = "NOT_ENOUGH_STOCK",
  TransactionNotFound = "TRANSACTION_NOT_FOUND",
  InvalidTransactionStatus = "INVALID_TRANSACTION_STATUS",
  FileUploadRequired = "FILE_UPLOAD_REQUIRED",
  ResourcesNotFound = "RESOURCES_NOT_FOUND"
}

export default AppErrorCode;
