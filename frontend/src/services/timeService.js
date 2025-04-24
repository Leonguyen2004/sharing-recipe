export const formatTimestampToDateTime = (timestamp) => {
    // Kiểm tra nếu timestamp là object với _seconds và _nanoseconds
    if (timestamp && timestamp._seconds !== undefined) {
        // Tạo đối tượng Date từ _seconds (bỏ qua nanoseconds vì không cần thiết cho định dạng này)
        const date = new Date(timestamp._seconds * 1000);
        
        // Lấy các thành phần ngày tháng
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng bắt đầu từ 0
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        
        // Tạo chuỗi định dạng hh:mm MM/dd/yyyy
        return `${hours}:${minutes} ${month}/${day}/${year}`;
    }
    return 'Invalid timestamp';
}
