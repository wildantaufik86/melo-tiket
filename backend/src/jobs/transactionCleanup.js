export const cleanExpiredTransactions = async () => {
  const expiredTransactions = await TransactionModel.find({
    status: "pending",
    expiredAt: { $lte: new Date() }, // Cari transaksi expired
  });

  for (const transaction of expiredTransactions) {
    for (const item of transaction.tickets) {
      const ticket = await TicketModel.findById(item.ticketId);
      if (ticket) {
        ticket.stock += item.quantity;
        await ticket.save();
      }
    }
    transaction.status = "expired";
    await transaction.save();
  }
};
