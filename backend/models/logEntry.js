class LogEntry {
    constructor({
                    timestamp,
                    userId,
                    actionType,
                    itemId,
                    details = {}
                }) {
        this.timestamp = timestamp || new Date().toISOString();
        this.userId = userId;
        this.actionType = actionType;
        this.itemId = itemId;
        this.details = details;
    }
}
//idhar new LogEntry(module.exports = LogEntry(timestamp, userId, actionType, itemId, {...details});

module.exports = LogEntry;