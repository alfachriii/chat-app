export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// storage
const request = indexedDB.open('seechatDB', 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;

  if (!db.objectStoreNames.contains('chats')) {
    const objectStore = db.createObjectStore('chats', { keyPath: 'id', autoIncrement: true });

    // Indeks tambahan untuk pencarian lainnya
    objectStore.createIndex('chatId', 'chatId', { unique: true });
    objectStore.createIndex('senderId', 'senderId', { unique: true });
    objectStore.createIndex('receiverId', 'receiverId', { unique: true });
    objectStore.createIndex('timestamp', 'timestamp', { unique: true });
  }
};

request.onerror = function (event) {
  console.error('Database error:', event.target.error);
};

export const saveMessage = (message) => {
  const request = indexedDB.open("seechatDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["chats"], "readwrite");
    const objectStore = transaction.objectStore("chats");

    objectStore.put(message);

    transaction.oncomplete = function () {
      console.log("Pesan berhasil disimpan:", message);
    };

    transaction.onerror = function (event) {
      console.error("Error menyimpan pesan:", event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.error);
  };
}

export const updateChat = (chatId, newChatData) => {
  const request = indexedDB.open("seechatDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["chats"], "readwrite");
    const objectStore = transaction.objectStore("chats");

    // Ambil data berdasarkan ID
    const chatIdIndex = objectStore.index("chatId");
    const getRequest = chatIdIndex.getAll(chatId);

    getRequest.onsuccess = function () {
      const oldData = getRequest.result;

      if (oldData) {
        // Ganti seluruh objek
        newChatData.id = oldData.id; // Pastikan ID tetap sama
        objectStore.put(newChatData); // Simpan objek baru
        console.log(`Pesan dengan ID ${chatId} berhasil diperbarui.`);
      } else {
        console.warn(`Pesan dengan ID ${chatId} tidak ditemukan.`);
      }
    };

    getRequest.onerror = function (event) {
      console.error("Error saat mengambil data pesan:", event.target.error);
    };
  };

  request.onerror = function (event) {
    console.error("Database error:", event.target.error);
  };
}