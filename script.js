
// Global variables
let packages = [];
let announcements = [];
let messages = [];
let currentEditingPackage = null;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    setupEventListeners();
    initTopAnnouncement();
});

// Initialize top announcement with dynamic content
function initTopAnnouncement() {
    const topAnnouncementScroll = document.getElementById('topAnnouncementScroll');

    // Check if there are user announcements, otherwise use default
    let announcementTexts = [];
    if (announcements.length > 0) {
        announcementTexts = announcements.map(ann => ann.text);
    } else {
        announcementTexts = [
            'Hoş geldiniz! Premium Roblox bot sistemimizle gruplarınızı abuse\'den koruyun! 🛡️ Şimdi %50 indirimli paketler mevcut!',
            '🔥 Yeni AI tabanlı koruma sistemi aktif! Gelişmiş güvenlik özellikleri ile gruplarınız tamamen güvende!',
            '⚡ 24/7 otomatik koruma sistemi ile abuse girişimlerini anlık olarak engelleyebilirsiniz!',
            '🎯 500+ müşterimiz bizimle güvende! Siz de premium koruma sistemimizin avantajlarından yararlanın!'
        ];
    }

    let currentIndex = 0;

    // Update announcement rotation to be faster (3 seconds)
    setInterval(() => {
        currentIndex = (currentIndex + 1) % announcementTexts.length;
        topAnnouncementScroll.textContent = announcementTexts[currentIndex];
    }, 3000);
}

// Load initial data
function loadInitialData() {
    // Load default packages
    packages = [
        {
            id: 1,
            name: 'Başlangıç',
            price: 49,
            duration: '1 Ay',
            type: 'basic',
            features: [
                'Temel Abuse Koruması',
                'Grup Denetimi',
                'Otomatik Kick',
                '24/7 Destek'
            ]
        },
        {
            id: 2,
            name: 'Standart',
            price: 129,
            duration: '3 Ay',
            type: 'standard',
            features: [
                'Gelişmiş Abuse Koruması',
                'Alt Hesap Tespiti',
                'IP Kontrolü',
                'Detaylı Loglar',
                'Whitelist Sistemi'
            ],
            popular: true
        },
        {
            id: 3,
            name: 'Premium',
            price: 239,
            duration: '6 Ay',
            type: 'premium',
            features: [
                'AI Tabanlı Koruma',
                'Gerçek Zamanlı Analiz',
                'Özel Filtreler',
                'VPN Tespiti',
                'VIP Destek'
            ]
        },
        {
            id: 4,
            name: 'Elit',
            price: 449,
            duration: '1 Yıl',
            type: 'elite',
            features: [
                'Maksimum Güvenlik',
                'Özel API Entegrasyonu',
                'Çoklu Grup Desteği',
                'Özel Geliştirme',
                'Dedike Destek'
            ]
        },
        {
            id: 5,
            name: 'Sınırsız',
            price: 999,
            duration: 'Ömür Boyu',
            type: 'unlimited',
            features: [
                'Tam Koruma Paketi',
                'Sınırsız Grup',
                'Kaynak Kodu',
                'Özel Geliştirme',
                '7/24 VIP Destek',
                'Ömür Boyu Güncellemeler'
            ]
        }
    ];

    // Load default announcements
    announcements = [
        {
            id: 1,
            text: 'Hoş geldiniz! Premium Roblox botumuzla gruplarınızı abuse\'den koruyun!',
            date: new Date().toLocaleDateString('tr-TR')
        },
        {
            id: 2,
            text: 'Yeni özelliklerin yeni olacağı Şerait olarak bilinen nerede olurum.',
            date: new Date().toLocaleDateString('tr-TR')
        },
        {
            id: 3,
            text: 'Şimdi yasal 500 kişinin premium kotumuz bulunuyor!',
            date: new Date().toLocaleDateString('tr-TR')
        },
        {
            id: 4,
            text: 'Roblox gruplarını atayık %50 güvenimle Öğrenim koruma sistemi eklendi!',
            date: new Date().toLocaleDateString('tr-TR')
        }
    ];

    renderPackages();
    renderAnnouncements();
    renderAdminContent();
}

// Setup event listeners
function setupEventListeners() {
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);

    // Admin forms
    document.getElementById('announcementForm').addEventListener('submit', handleAnnouncementForm);
    document.getElementById('packageForm').addEventListener('submit', handlePackageForm);

    // Listen for #admin command anywhere on the page
    document.addEventListener('keydown', (e) => {
        try {
            handleAdminCommand(e);

            // Alternative admin access: Ctrl+Shift+A (multiple variations)
            if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.code === 'KeyA')) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 65)) {
                e.preventDefault();
                console.log('Ctrl+Shift+A detected, showing password modal');
                showPasswordModal();
                return;
            }
        } catch (error) {
            console.error('Admin command handler error:', error);
        }
    });

    // Add direct admin access button (hidden, for testing)
    const adminTestBtn = document.createElement('button');
    adminTestBtn.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: rgba(0,0,0,0.1);
        border: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.3);
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        cursor: pointer;
    `

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Handle #admin command detection
let adminCommandBuffer = '';
let adminCommandVariations = ['#admin', '/admin', '/#admin', 'admin'];

function handleAdminCommand(e) {
    // Safety check for e.key
    if (!e || typeof e.key !== 'string') return;

    // Reset buffer if user hasn't typed for 2 seconds
    clearTimeout(window.adminCommandTimeout);
    window.adminCommandTimeout = setTimeout(() => {
        adminCommandBuffer = '';
    }, 2000);

    // Add typed character to buffer - extra safety check
    if (e.key && e.key.length === 1) {
        adminCommandBuffer += e.key;

        // Keep buffer manageable (last 20 characters)
        if (adminCommandBuffer.length > 20) {
            adminCommandBuffer = adminCommandBuffer.slice(-20);
        }
    } else if (e.key === 'Backspace') {
        adminCommandBuffer = adminCommandBuffer.slice(0, -1);
    }

    // Check if any admin command variation was typed - with safety check
    try {
        for (let command of adminCommandVariations) {
            if (adminCommandBuffer && adminCommandBuffer.toLowerCase().includes(command)) {
                adminCommandBuffer = '';
                showPasswordModal();
                e.preventDefault();
                break;
            }
        }
    } catch (error) {
        console.error('Admin command error:', error);
        adminCommandBuffer = '';
    }
}

// Render packages on the main page
function renderPackages() {
    const packagesGrid = document.getElementById('packagesGrid');
    packagesGrid.innerHTML = '';

    packages.forEach(package => {
        const packageDiv = document.createElement('div');
        packageDiv.className = `package ${package.popular ? 'popular' : ''}`;

        packageDiv.innerHTML = `
            <h3>${package.name}</h3>
            <div class="price">₺${package.price}</div>
            <div class="duration">${package.duration}</div>
            <ul>
                ${package.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="buy-btn" onclick="openPurchaseModal(${package.id})">Satın Al</button>
        `;

        packagesGrid.appendChild(packageDiv);
    });
}

// Render announcements
function renderAnnouncements() {
    const announcementsList = document.getElementById('announcementsList');
    announcementsList.innerHTML = '';

    if (announcements.length === 0) {
        announcementsList.innerHTML = '<div class="loading">Henüz duyuru bulunmuyor.</div>';
        return;
    }

    announcements.forEach(announcement => {
        const announcementDiv = document.createElement('div');
        announcementDiv.className = 'announcement fade-in';
        announcementDiv.innerHTML = `
            <p>${announcement.text}</p>
            <small>Tarih: ${announcement.date}</small>
        `;
        announcementsList.appendChild(announcementDiv);
    });
}

// Render admin content
function renderAdminContent() {
    renderAdminAnnouncements();
    renderAdminPackages();
    renderAdminMessages();
}

// Render admin announcements
function renderAdminAnnouncements() {
    const adminAnnouncementsList = document.getElementById('adminAnnouncementsList');
    adminAnnouncementsList.innerHTML = '';

    announcements.forEach(announcement => {
        const announcementDiv = document.createElement('div');
        announcementDiv.className = 'admin-item';
        announcementDiv.innerHTML = `
            <div class="admin-item-content">
                <p>${announcement.text}</p>
                <small>${announcement.date}</small>
            </div>
            <div class="admin-item-actions">
                <button class="delete-btn" onclick="deleteAnnouncement(${announcement.id})">Sil</button>
            </div>
        `;
        adminAnnouncementsList.appendChild(announcementDiv);
    });
}

// Render admin packages
function renderAdminPackages() {
    const adminPackagesList = document.getElementById('adminPackagesList');
    adminPackagesList.innerHTML = '';

    packages.forEach(package => {
        const packageDiv = document.createElement('div');
        packageDiv.className = 'admin-item';
        packageDiv.innerHTML = `
            <div class="admin-item-content">
                <h4>${package.name} - ₺${package.price}</h4>
                <p>${package.duration} | ${package.features.length} özellik</p>
            </div>
            <div class="admin-item-actions">
                <button class="edit-btn" onclick="editPackage(${package.id})">Düzenle</button>
                <button class="delete-btn" onclick="deletePackage(${package.id})">Sil</button>
            </div>
        `;
        adminPackagesList.appendChild(packageDiv);
    });
}

// Render admin messages
function renderAdminMessages() {
    const adminMessagesList = document.getElementById('adminMessagesList');
    adminMessagesList.innerHTML = '';

    if (messages.length === 0) {
        adminMessagesList.innerHTML = '<div class="loading">Henüz mesaj bulunmuyor.</div>';
        return;
    }

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'admin-item';
        messageDiv.innerHTML = `
            <div class="admin-item-content">
                <h4>${message.subject}</h4>
                <p><strong>From:</strong> ${message.email}</p>
                <p>${message.message.substring(0, 100)}...</p>
                <small>${message.date}</small>
            </div>
            <div class="admin-item-actions">
                <button class="delete-btn" onclick="deleteMessage(${message.id})">Sil</button>
            </div>
        `;
        adminMessagesList.appendChild(messageDiv);
    });
}

// Handle contact form submission
async function handleContactForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Validation
    if (!email || !subject || !message) {
        showMessage('Lütfen tüm alanları doldurun!', 'error');
        return;
    }

    const messageData = {
        id: Date.now(),
        email: email,
        subject: subject,
        message: message,
        date: new Date().toLocaleDateString('tr-TR')
    };

    // Add to messages array (in real app, this would be sent to backend)
    messages.push(messageData);

    // Simulate sending email
    try {
        // In real implementation, you would send this to your backend
        // which would then forward it to iletisim@buy.smmkiwi.com
        await simulateEmailSend(messageData);

        showMessage('✅ Mesajınız başarıyla gönderildi!', 'success');
        e.target.reset();

        // Immediate update to admin messages
        renderAdminMessages();
    } catch (error) {
        showMessage('Mesaj gönderirken bir hata oluştu.', 'error');
    }
}

// Simulate email sending
function simulateEmailSend(messageData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Email sent to iletisim@buy.smmkiwi.com:', messageData);
            resolve();
        }, 1000);
    });
}

// Show password modal
function showPasswordModal() {
    // Remove existing password modal if any
    closePasswordModal();

    const passwordModal = document.createElement('div');
    passwordModal.className = 'password-modal';
    passwordModal.id = 'passwordModal';
    passwordModal.innerHTML = `
        <div class="password-modal-content">
            <h3>🔒 Admin Panel Girişi</h3>
            <input type="password" id="adminPassword" placeholder="Şifre: admin123" maxlength="50" />
            <div class="password-buttons">
                <button type="button" class="login-btn" onclick="checkAdminPassword()">
                    <i class="fas fa-sign-in-alt"></i> Giriş Yap
                </button>
                <button type="button" class="cancel-btn" onclick="closePasswordModal()">
                    <i class="fas fa-times"></i> İptal
                </button>
            </div>
            <p class="password-hint">Şifre: admin123</p>
        </div>
    `;
    document.body.appendChild(passwordModal);

    // Focus on password input with delay
    setTimeout(() => {
        const input = document.getElementById('adminPassword');
        if (input) {
            input.focus();
            input.select();
        }
    }, 200);

    // Add event listeners
    const passwordInput = document.getElementById('adminPassword');
    if (passwordInput) {
        // Enter key to submit
        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                checkAdminPassword();
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                closePasswordModal();
            }
        });

        // Clear error on typing
        passwordInput.addEventListener('input', () => {
            passwordInput.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
    }

    // Click outside to close
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            closePasswordModal();
        }
    });
}

// Check admin password
function checkAdminPassword() {
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) {
        console.error('Password input not found');
        return;
    }

    const password = passwordInput.value.trim();
    const correctPassword = 'admin123';

    console.log('Checking password:', password); // Debug log

    if (password === correctPassword) {
        closePasswordModal();
        setTimeout(() => {
            openModal('adminModal');
            showMessage('✅ Admin paneline başarıyla giriş yapıldı!', 'success');
        }, 100);
    } else {
        // Show error
        passwordInput.style.borderColor = '#ff4757';
        passwordInput.style.boxShadow = '0 0 0 2px rgba(255, 71, 87, 0.3)';
        showMessage('❌ Hatalı şifre! Doğru şifre: admin123', 'error');
        passwordInput.value = '';
        passwordInput.focus();

        // Shake animation
        const modal = passwordInput.closest('.password-modal-content');
        if (modal) {
            modal.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                modal.style.animation = '';
            }, 500);
        }
    }
}

// Close password modal
function closePasswordModal() {
    const passwordModal = document.getElementById('passwordModal');
    if (passwordModal) {
        passwordModal.remove();
    }
    // Also remove any old ones
    document.querySelectorAll('.password-modal').forEach(modal => {
        modal.remove();
    });
}

// Handle announcement form submission
function handleAnnouncementForm(e) {
    e.preventDefault();

    const announcementText = document.getElementById('announcementText').value.trim();
    if (!announcementText) {
        showMessage('Lütfen duyuru metnini girin!', 'error');
        return;
    }

    const newAnnouncement = {
        id: Date.now(),
        text: announcementText,
        date: new Date().toLocaleDateString('tr-TR')
    };

    announcements.unshift(newAnnouncement);

    // Immediate updates to all parts of the site
    renderAnnouncements(); // Update main site announcements
    renderAdminAnnouncements(); // Update admin panel announcements

    // Update top announcement rotation with new announcements immediately
    initTopAnnouncement();

    // Clear the form
    document.getElementById('announcementText').value = '';

    // Show success message with animation
    showMessage('✅ Duyuru başarıyla eklendi!', 'success');

    // Scroll to announcements section for visual feedback
    setTimeout(() => {
        const announcementsSection = document.getElementById('announcements');
        if (announcementsSection) {
            announcementsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 500);
}

// Handle package form submission
function handlePackageForm(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const featuresText = formData.get('packageFeatures') || '';

    if (featuresText.trim() === '') {
        showMessage('Lütfen paket özelliklerini girin!', 'error');
        return;
    }

    const packageData = {
        id: currentEditingPackage || Date.now(),
        name: formData.get('packageName'),
        price: parseInt(formData.get('packagePrice')),
        duration: formData.get('packageDuration'),
        type: formData.get('packageType'),
        features: featuresText.trim().split('\n').filter(f => f.trim() !== '')
    };

    if (currentEditingPackage) {
        // Update existing package
        const index = packages.findIndex(p => p.id === currentEditingPackage);
        if (index !== -1) {
            // Preserve popular status if it exists
            if (packages[index].popular) {
                packageData.popular = packages[index].popular;
            }
            packages[index] = packageData;
            currentEditingPackage = null;
            showMessage('✅ Paket başarıyla güncellendi!', 'success');
        }
    } else {
        // Add new package
        packages.push(packageData);
        showMessage('✅ Paket başarıyla eklendi!', 'success');
    }

    // Immediate updates to all parts of the site
    renderPackages(); // Update main site packages
    renderAdminPackages(); // Update admin panel packages

    // Clear the form
    e.target.reset();

    // Scroll to updated packages for visual feedback
    setTimeout(() => {
        const packagesSection = document.getElementById('features');
        if (packagesSection) {
            packagesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 500);
}

// Delete announcement
function deleteAnnouncement(id) {
    if (confirm('Bu duyuruyu silmek istediğinizden emin misiniz?')) {
        announcements = announcements.filter(a => a.id !== id);

        // Immediate updates to all parts of the site
        renderAnnouncements(); // Update main site announcements
        renderAdminAnnouncements(); // Update admin panel announcements

        // Update top announcement rotation immediately
        initTopAnnouncement();

        showMessage('✅ Duyuru başarıyla silindi!', 'success');
    }
}

// Delete package
function deletePackage(id) {
    if (confirm('Bu paketi silmek istediğinizden emin misiniz?')) {
        packages = packages.filter(p => p.id !== id);

        // Immediate updates to all parts of the site
        renderPackages(); // Update main site packages
        renderAdminPackages(); // Update admin panel packages

        showMessage('✅ Paket başarıyla silindi!', 'success');
    }
}

// Edit package
function editPackage(id) {
    const package = packages.find(p => p.id === id);
    if (!package) return;

    currentEditingPackage = id;

    document.getElementById('packageName').value = package.name || '';
    document.getElementById('packagePrice').value = package.price || '';
    document.getElementById('packageDuration').value = package.duration || '';
    document.getElementById('packageType').value = package.type || 'basic';
    document.getElementById('packageFeatures').value = (package.features && Array.isArray(package.features) && package.features.length > 0) ? package.features.join('\n') : '';

    // Scroll to the form
    document.getElementById('packageForm').scrollIntoView({ behavior: 'smooth' });

    showMessage('Paket düzenleme modunda. Formu doldurup güncelleyin.', 'success');
}

// Delete message
function deleteMessage(id) {
    if (confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
        messages = messages.filter(m => m.id !== id);

        // Immediate update to admin messages
        renderAdminMessages();

        showMessage('✅ Mesaj başarıyla silindi!', 'success');
    }
}

// Open purchase modal
function openPurchaseModal(packageId) {
    const package = packages.find(p => p.id === packageId);
    if (!package) return;

    const purchaseContent = document.getElementById('purchaseContent');
    purchaseContent.innerHTML = `
        <div class="purchase-summary">
            <h3>${package.name} Paketi</h3>
            <div class="price">₺${package.price}</div>
            <div class="duration">${package.duration}</div>
            <ul>
                ${package.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
        </div>
        
        <div class="purchase-options">
            <div class="purchase-option" onclick="selectPaymentMethod('bank')">
                <i class="fas fa-university"></i>
                <div class="purchase-option-info">
                    <h4>Banka Transferi (IBAN)</h4>
                    <p>Güvenli banka transferi ile ödeme yapın</p>
                </div>
            </div>
            
            <div class="purchase-option" onclick="selectPaymentMethod('papara')">
                <i class="fas fa-credit-card"></i>
                <div class="purchase-option-info">
                    <h4>Papara</h4>
                    <p>Papara ile hızlı ve güvenli ödeme</p>
                </div>
            </div>
            
            <div class="purchase-option" onclick="selectPaymentMethod('itemsatis')">
                <i class="fas fa-shopping-cart"></i>
                <div class="purchase-option-info">
                    <h4>ItemSatış</h4>
                    <p>ItemSatış platformu üzerinden satın alın</p>
                </div>
            </div>
        </div>
        
        <div id="payment-details" class="payment-details" style="display: none;">
            <!-- Payment details will be loaded here -->
        </div>
    `;

    openModal('purchaseModal');
}

// Select payment method
function selectPaymentMethod(method) {
    const paymentDetails = document.getElementById('payment-details');
    paymentDetails.style.display = 'block';

    let content = '';

    switch (method) {
        case 'bank':
            content = `
                <div class="payment-info">
                    <h4>Banka Transfer Bilgileri</h4>
                    <p><strong>Banka:</strong> <span>Türkiye İş Bankası</span></p>
                    <p><strong>IBAN:</strong> <span>TR33 0006 4000 0011 2345 6789 01</span></p>
                    <p><strong>Ad Soyad:</strong> <span>Discord Bot Premium</span></p>
                    <p><strong>Açıklama:</strong> <span>Lütfen açıklama kısmına Discord kullanıcı adınızı yazınız</span></p>
                </div>
            `;
            break;
        case 'papara':
            content = `
                <div class="payment-info">
                    <h4>Papara Ödeme Bilgileri</h4>
                    <p><strong>Papara No:</strong> <span>1234567890</span></p>
                    <p><strong>Ad Soyad:</strong> <span>Discord Bot Premium</span></p>
                    <p><strong>Açıklama:</strong> <span>Discord kullanıcı adınızı yazınız</span></p>
                </div>
            `;
            break;
        case 'itemsatis':
            content = `
                <div class="payment-info">
                    <h4>ItemSatış Ödeme</h4>
                    <p><strong>Mağaza:</strong> <span>discord-bot-premium</span></p>
                    <p><strong>ItemSatış'ta Satın Al:</strong> <span><a href="ItemSatış'ta Satın Al" target="_blank" style="color: #2196F3;">ItemSatış'ta Satın Al</a></span></p>
                    <p><strong>Satın aldıktan sonra Discord üzerinden iletişime geçiniz</strong></p>
                </div>
            `;
            break;
    }

    paymentDetails.innerHTML = content;
}

// Handle purchase
function handlePurchase(e, packageId) {
    e.preventDefault();
    showMessage('Paket başarıyla eklendi!', 'success');
    closeModal('purchaseModal');
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    if (modalId === 'adminModal') {
        currentEditingPackage = null;
    }
}

// Tab functions
function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabId).classList.add('active');

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Text formatting functions
function formatText(command) {
    const textarea = document.getElementById('message');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = selectedText;
    switch (command) {
        case 'bold':
            formattedText = `**${selectedText}**`;
            break;
        case 'italic':
            formattedText = `*${selectedText}*`;
            break;
        case 'underline':
            formattedText = `__${selectedText}__`;
            break;
    }

    textarea.value = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(start, start + formattedText.length);
}

// Show message function with animation
function showMessage(text, type) {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());

    const message = document.createElement('div');
    message.className = `message ${type}`;

    // Add animated checkmark for success messages
    if (type === 'success') {
        message.innerHTML = `
            <div class="message-content">
                <div class="checkmark-animation">
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkmark-check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>
                <span>${text}</span>
            </div>
        `;
    } else {
        message.textContent = text;
    }

    // Insert at the top of the body
    document.body.insertBefore(message, document.body.firstChild);

    // Remove after 4 seconds for better UX
    setTimeout(() => {
        if (message.parentNode) {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-50px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
