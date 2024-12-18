export function formatMessageTime(date) {
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(date).toLocaleTimeString("en-US", options);
}

export function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

export const combineDataUser = (users, messages) => {
  // Buat hash map dari messages berdasarkan senderId
  console.log(messages);
  console.log(users);
  const messageMap = messages.reduce((acc, msg) => {
    acc[msg._id] = msg; // Asumsi pesan terakhir adalah pesan terbaru
    return acc;
  }, {});

  // Gabungkan data users dengan pesan terakhir
  return users.map((user) => ({
    ...user,
    message: messageMap[user._id] || null, // Jika tidak ada pesan, nilai default null
  }));
};

export const updateChatMessage = (chats, targetChatId, data) => {
  const chatIndex = chats.findIndex((chat) => chat._id === targetChatId);
  console.log(targetChatId);

  if (chatIndex !== -1) {
    const updatedChats = [...chats];
    const currentChat = updatedChats[chatIndex];
    const currentUnreadCount = currentChat?.message?.unreadCount || 0;

    updatedChats[chatIndex] = {
      ...currentChat,
      message: {
        ...currentChat.message,
        latestMessage: {
          ...currentChat.message?.latestMessage,
          status: data.status,
          ...data?.msg && {
            text: data.msg,
            createdAt: data.time,
          },
        },
        unreadCount: data?.msg ? !data.from ? currentUnreadCount + 1 : 0 : currentUnreadCount, // Menambahkan unreadCount jika ada msg baru
      },
    };
    return updatedChats;
  }

  return chats; // Return as is if targetChatId not found
};

// storage
const DB_NAME = "seeChatDB";
const DB_VERSION = 1;
const STORE_NAME = "chats";

let db;

export function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const store = db.createObjectStore(STORE_NAME, { keyPath: "_id" });

      // store.createIndex('_id', '_id', { unique: true });
      // store.createIndex('receiverId', 'receiverId', { unique: false });
      store.createIndex("createdAt", "createdAt", { unique: false }); // Menambahkan index untuk timestamp
      store.createIndex("updatedAt", "updatedAt", { unique: false }); // Menambahkan index untuk timestamp
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      console.log("Database berhasil dibuka!");
      resolve(db);
    };

    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };
  });
}

export function saveBulkDataWithCursorCheck(dataArray) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    console.log("Memulai batch insert dengan cursor check...");

    // Fungsi untuk insert data jika id belum ada
    const insertIfNotExists = (data) => {
      return new Promise((resolve, reject) => {
        const request = store.openCursor();

        let exists = false;

        request.onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.id === data.id) {
              exists = true; // Data sudah ada
            }
            cursor.continue();
          } else {
            // Jika cursor selesai dan data belum ditemukan, lakukan insert
            if (!exists) {
              store.put(data);
            }
            resolve(); // Selesaikan promise
          }
        };

        request.onerror = (event) => {
          console.error("Cursor error:", event.target.error);
          reject(event.target.error);
        };
      });
    };

    // Iterasi dataArray menggunakan for loop
    const promises = [];
    for (let i = 0; i < dataArray.length; i++) {
      promises.push(insertIfNotExists(dataArray[i]));
    }

    // Tunggu semua data selesai diproses
    Promise.all(promises)
      .then(() => {
        console.log("Batch insert dengan cursor check selesai.");
        resolve();
      })
      .catch((error) => {
        console.error("Error saat batch insert dengan cursor check:", error);
        reject(error);
      });
  });
}

export const fetchUserList = async () => {
  // Ambil data dari IndexedDB
  const request = indexedDB.open(DB_NAME, DB_VERSION); // Sesuaikan nama dan versi database
  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction(STORE_NAME, "readonly"); // Sesuaikan dengan nama objectStore
    const store = transaction.objectStore(STORE_NAME);
    const getAllRequest = store.getAll(); // Ambil semua data

    getAllRequest.onsuccess = () => {
      const data = getAllRequest.result;
      console.log(getAllRequest.result);

      // Urutkan data berdasarkan 'updatedAt' atau 'createdAt' dari yang terbaru
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.updatedAt);
        const dateB = new Date(b.updatedAt);

        // Cek apakah dateA dan dateB valid
        if (isNaN(dateA) || isNaN(dateB)) {
          console.error("Invalid date:", a.updatedAt, b.updatedAt);
          return 0; // Jika ada tanggal tidak valid, jangan ubah urutan
        }

        return dateB - dateA; // Urutkan dari yang terbaru
      });

      return sortedData;
    };
  };
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
};

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
};
