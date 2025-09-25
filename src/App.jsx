import React, { useState, useEffect } from 'react';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(1);
  const [endTime, setEndTime] = useState('');
  const [letterFile, setLetterFile] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const rooms = [
    '1.0.1', '1.0.2', '1.0.7', '1.0.8',
    '2.0.4 A', '2.0.4 B', '2.0.5 A', '2.0.5 B',
    '2.0.5 C', '2.0.5 D', '4.0.1', '4.0.2',
    '4.0.3', '4.0.4'
  ];

  useEffect(() => {
    if (!startTime) {
      setEndTime('');
      return;
    }
    
    const start = new Date(startTime);
    start.setMinutes(0, 0, 0);
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);
    setEndTime(end.toISOString().slice(0, 16));
  }, [startTime, duration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !purpose || !startTime || !endTime || !letterFile || !selectedRoom) {
      alert('Mohon lengkapi semua field yang diperlukan!');
      return;
    }
    
    if (letterFile.type !== 'application/pdf') {
      alert('File harus dalam format PDF!');
      return;
    }
    
    if (letterFile.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB!');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('Mengupload file dan menyimpan data...');
    
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('purpose', purpose);
      formData.append('room', selectedRoom);
      formData.append('startTime', startTime);
      formData.append('endTime', endTime);
      formData.append('file', letterFile);
      
      // GANTI DENGAN WEB APP URL ANDA
      const response = await fetch('https://https://script.google.com/macros/s/AKfycbyVWK5cYBBvvl6FpKw_nlNogSK5pN1gYAeG_hhiesBJZ0XU3gQ3rgw4TlwDkMTfL6Lw/exec.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setSubmitMessage('✅ Pengajuan berhasil! Menunggu persetujuan admin.');
        setName('');
        setEmail('');
        setPurpose('');
        setStartTime('');
        setEndTime('');
        setLetterFile(null);
        setSelectedRoom(null);
      } else {
        setSubmitMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setSubmitMessage('❌ Gagal mengirim data. Coba lagi nanti.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
      // GANTI DENGAN SPREADSHEET URL ANDA
      window.open('https://docs.google.com/spreadsheets/d/1CCw3NtqClb2hJQ5kzoH2pJrqi3ek--BoRBQTqx4mFfA/edit', '_blank');
    } else {
      alert('Password admin salah!');
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🔐 Admin Dashboard</h2>
          <p className="text-gray-600 mb-6">
            Anda akan diarahkan ke Google Sheets untuk mengelola peminjaman.
          </p>
          <button
            onClick={() => setIsAdmin(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Kembali ke Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-3xl font-bold text-white">🏢 Sistem Booking Ruangan</h1>
          <p className="text-white/90 mt-2">Booking ruangan mudah, cepat, dan terorganisir</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Form Peminjaman Ruangan</h2>
          
          {submitMessage && (
            <div className={`p-4 rounded-lg mb-6 text-center ${
              submitMessage.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {submitMessage}
            </div>
          )}
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <h3 className="font-semibold text-blue-800 mb-2">📝 Petunjuk Penggunaan</h3>
            <p className="text-blue-700">
              Pilih tanggal dan waktu mulai peminjaman (jam harus bulat, menit:00), tentukan durasi (kelipatan 60 menit), 
              upload surat permohonan dalam format PDF, lalu pilih ruangan yang tersedia (berwarna hijau). 
              Data akan disimpan otomatis ke Google Sheets dan file ke Google Drive.
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan email aktif Anda"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tujuan Peminjaman *</label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Jelaskan tujuan peminjaman ruangan secara detail"
                rows="3"
                required
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">⏰ Waktu Peminjaman</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal & Jam Mulai *</label>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Durasi Peminjaman *</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1,2,3,4,5,6,7,8].map(hours => (
                      <option key={hours} value={hours}>{hours} jam</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Jam Selesai (Otomatis)</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Surat Permohonan (PDF) *</label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setLetterFile(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-lg"
                required
              />
              <p className="text-sm text-gray-600 mt-2">File harus dalam format PDF dan ukuran maksimal 5MB</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">🏢 Pilih Ruangan</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {rooms.map(room => (
                  <button
                    key={room}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                    className={`p-3 rounded-lg font-medium transition-all ${
                      selectedRoom === room 
                        ? 'bg-orange-500 text-white shadow-md transform scale-105' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Mengirim...' : 'Ajukan Peminjaman'}
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">🔐 Akses Halaman Admin</h3>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Masukkan password admin"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleAdminLogin}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Login Admin
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Admin akan diarahkan ke Google Sheets untuk mengelola peminjaman
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;