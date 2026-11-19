/**
 * PaaniLink Water Tanker Booking System
 * Mock API - localStorage-backed, simulates 300ms network delay
 * Exposes: window.mockApi
 */

const DELAY = 300;
const KEYS = {
  users:    'pl_users',
  zones:    'pl_zones',
  hydrants: 'pl_hydrants',
  tankers:  'pl_tankers',
  drivers:  'pl_drivers',
  bookings: 'pl_bookings',
  session:  'pl_session',
};

const delay = (ms = DELAY) => new Promise(r => setTimeout(r, ms));
const ok  = (data) => ({ success: true,  data,  error: null });
const err = (msg)  => ({ success: false, data: null, error: msg });

function load(key)        { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function uid()            { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function isoDate(daysOffset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString();
}

const SEED = {
  zones: [
    { id: 'zone1', name: 'North Zone', hydrantIds: ['h1', 'h2'] },
    { id: 'zone2', name: 'South Zone', hydrantIds: ['h3'] },
  ],
  hydrants: [
    { id: 'h1', name: 'Hydrant A', zoneId: 'zone1', operatorId: 'u5', dailyQuotaGallons: 50000, remainingQuota: 38000, operatingHoursStart: '06:00', operatingHoursEnd: '20:00', tankerIds: ['t1', 't2'] },
    { id: 'h2', name: 'Hydrant B', zoneId: 'zone1', operatorId: 'u6', dailyQuotaGallons: 40000, remainingQuota: 27500, operatingHoursStart: '07:00', operatingHoursEnd: '19:00', tankerIds: ['t3', 't4'] },
    { id: 'h3', name: 'Hydrant C', zoneId: 'zone2', operatorId: 'u7', dailyQuotaGallons: 60000, remainingQuota: 51000, operatingHoursStart: '05:30', operatingHoursEnd: '21:00', tankerIds: ['t5', 't6'] },
  ],
  tankers: [
    { id: 't1', hydrantId: 'h1', capacityGallons: 3000, registrationNo: 'ABC-1234', driverIds: ['d1'], available: true  },
    { id: 't2', hydrantId: 'h1', capacityGallons: 1000, registrationNo: 'ABC-5678', driverIds: ['d2'], available: false },
    { id: 't3', hydrantId: 'h2', capacityGallons: 6000, registrationNo: 'DEF-1111', driverIds: ['d1'], available: true  },
    { id: 't4', hydrantId: 'h2', capacityGallons: 3000, registrationNo: 'DEF-2222', driverIds: ['d2'], available: true  },
    { id: 't5', hydrantId: 'h3', capacityGallons: 6000, registrationNo: 'GHI-9999', driverIds: ['d3'], available: true  },
    { id: 't6', hydrantId: 'h3', capacityGallons: 1000, registrationNo: 'GHI-8888', driverIds: ['d3'], available: false },
  ],
  users: [
    { id: 'u1',  name: 'Admin User',      cnic: '12345-1234567-1', phone: '0300-0000001', address: 'Head Office, Lahore',                    zone: null,    role: 'admin',             email: 'admin@paanilink.com',   password: 'admin123',   subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0 },
    { id: 'u2',  name: 'Zeeshan Ahmed',   cnic: '35202-1111111-1', phone: '0301-1111111', address: 'North Zone Office, Lahore',              zone: 'zone1', role: 'zone_officer',      email: 'zeeshan@paanilink.com', password: 'officer123', subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0 },
    { id: 'u3',  name: 'Sara Khan',       cnic: '35202-2222222-2', phone: '0302-2222222', address: 'South Zone Office, Lahore',              zone: 'zone2', role: 'zone_officer',      email: 'sara@paanilink.com',    password: 'officer123', subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0 },
    { id: 'u5',  name: 'Tariq Mehmood',   cnic: '35202-3333333-3', phone: '0303-3333333', address: 'Hydrant A Site, North Zone',             zone: 'zone1', role: 'hydrant_operator',  email: 'tariq@paanilink.com',   password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0, hydrantId: 'h1' },
    { id: 'u6',  name: 'Bilal Raza',      cnic: '35202-4444444-4', phone: '0304-4444444', address: 'Hydrant B Site, North Zone',             zone: 'zone1', role: 'hydrant_operator',  email: 'bilal@paanilink.com',   password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0, hydrantId: 'h2' },
    { id: 'u7',  name: 'Farhan Iqbal',    cnic: '35202-5555555-5', phone: '0305-5555555', address: 'Hydrant C Site, South Zone',             zone: 'zone2', role: 'hydrant_operator',  email: 'farhan@paanilink.com',  password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0, hydrantId: 'h3' },
    { id: 'u8',  name: 'Imran Ali',       cnic: '35202-6666666-6', phone: '0306-6666666', address: 'Model Town, Lahore',                     zone: null,    role: 'driver',            email: 'imran@paanilink.com',   password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0, driverId: 'd1' },
    { id: 'u9',  name: 'Nasir Hussain',   cnic: '35202-7777777-7', phone: '0307-7777777', address: 'Gulberg, Lahore',                        zone: null,    role: 'driver',            email: 'nasir@paanilink.com',   password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0, driverId: 'd2' },
    { id: 'u10', name: 'Khalid Mahmood',  cnic: '35202-8888888-8', phone: '0308-8888888', address: 'Johar Town, Lahore',                     zone: null,    role: 'driver',            email: 'khalid@paanilink.com',  password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0, driverId: 'd3' },
    { id: 'u11', name: 'Ayesha Siddiqui', cnic: '35202-9999999-9', phone: '0309-9999999', address: 'House 12, Street 4, DHA Phase 5, Lahore', zone: 'zone1', role: 'customer',          email: 'ayesha@example.com',    password: 'pass123',    subsidyStatus: 'approved', subsidyProof: 'proof_doc_ayesha.pdf', monthlyLimit: 5000, monthlyUsed: 2000 },
    { id: 'u12', name: 'Hamid Nawaz',     cnic: '35202-0000000-0', phone: '0310-0000000', address: 'Flat 3B, Gulshan Block, Lahore',          zone: 'zone2', role: 'customer',          email: 'hamid@example.com',     password: 'pass123',    subsidyStatus: 'pending',  subsidyProof: 'proof_doc_hamid.pdf',  monthlyLimit: null, monthlyUsed: 0 },
    { id: 'u13', name: 'Rabia Tahir',     cnic: '35202-1122334-5', phone: '0311-1122334', address: 'Plot 55, Cavalry Ground, Lahore',         zone: 'zone1', role: 'customer',          email: 'rabia@example.com',     password: 'pass123',    subsidyStatus: 'none',     subsidyProof: null,                   monthlyLimit: null, monthlyUsed: 0 },
  ],
  drivers: [
    { id: 'd1', userId: 'u8',  name: 'Imran Ali',      phone: '0306-6666666', assignedTankerId: 't1', available: true  },
    { id: 'd2', userId: 'u9',  name: 'Nasir Hussain',  phone: '0307-7777777', assignedTankerId: 't2', available: false },
    { id: 'd3', userId: 'u10', name: 'Khalid Mahmood', phone: '0308-8888888', assignedTankerId: 't5', available: true  },
  ],
  bookings: [
    { id: 'b1', customerId: 'u11', hydrantId: 'h1', tankerId: 't1', driverId: 'd1', zoneId: 'zone1', type: 'subsidised', status: 'delivered',       paymentStatus: 'paid',    amount: 500,  createdAt: isoDate(-10), scheduledDate: isoDate(-9), deliveryAddress: 'House 12, Street 4, DHA Phase 5, Lahore', confirmedAt: isoDate(-9), notes: 'Morning delivery preferred' },
    { id: 'b2', customerId: 'u13', hydrantId: 'h1', tankerId: 't1', driverId: 'd1', zoneId: 'zone1', type: 'commercial', status: 'in_transit',       paymentStatus: 'paid',    amount: 2800, createdAt: isoDate(-1),  scheduledDate: isoDate(0),  deliveryAddress: 'Plot 55, Cavalry Ground, Lahore',         confirmedAt: null,        notes: '' },
    { id: 'b3', customerId: 'u12', hydrantId: 'h3', tankerId: 't5', driverId: 'd3', zoneId: 'zone2', type: 'commercial', status: 'approved',         paymentStatus: 'pending', amount: 5500, createdAt: isoDate(-2),  scheduledDate: isoDate(1),  deliveryAddress: 'Flat 3B, Gulshan Block, Lahore',          confirmedAt: null,        notes: 'Need 6000 gallon tanker' },
    { id: 'b4', customerId: 'u11', hydrantId: 'h2', tankerId: null, driverId: null, zoneId: 'zone1', type: 'subsidised', status: 'pending_approval', paymentStatus: 'pending', amount: 300,  createdAt: isoDate(-1),  scheduledDate: isoDate(2),  deliveryAddress: 'House 12, Street 4, DHA Phase 5, Lahore', confirmedAt: null,        notes: '' },
    { id: 'b5', customerId: 'u13', hydrantId: 'h2', tankerId: 't3', driverId: 'd1', zoneId: 'zone1', type: 'commercial', status: 'assigned',         paymentStatus: 'paid',    amount: 5500, createdAt: isoDate(-3),  scheduledDate: isoDate(0),  deliveryAddress: 'Plot 55, Cavalry Ground, Lahore',         confirmedAt: null,        notes: 'Large order for construction site' },
    { id: 'b6', customerId: 'u12', hydrantId: 'h3', tankerId: null, driverId: null, zoneId: 'zone2', type: 'subsidised', status: 'cancelled',        paymentStatus: 'pending', amount: 0,    createdAt: isoDate(-5),  scheduledDate: isoDate(-4), deliveryAddress: 'Flat 3B, Gulshan Block, Lahore',          confirmedAt: null,        notes: 'Cancelled: subsidy not yet approved' },
    { id: 'b7', customerId: 'u11', hydrantId: 'h1', tankerId: 't1', driverId: 'd1', zoneId: 'zone1', type: 'subsidised', status: 'disputed',         paymentStatus: 'paid',    amount: 500,  createdAt: isoDate(-15), scheduledDate: isoDate(-14),deliveryAddress: 'House 12, Street 4, DHA Phase 5, Lahore', confirmedAt: null,        notes: 'Dispute: tanker arrived half-empty' },
    { id: 'b8', customerId: 'u13', hydrantId: 'h3', tankerId: 't5', driverId: 'd3', zoneId: 'zone2', type: 'commercial', status: 'delivered',        paymentStatus: 'paid',    amount: 5500, createdAt: isoDate(-7),  scheduledDate: isoDate(-6), deliveryAddress: 'Plot 55, Cavalry Ground, Lahore',         confirmedAt: isoDate(-6), notes: '' },
  ],
};

function initStorage() {
  for (const key of Object.keys(KEYS)) {
    if (key === 'session') continue;
    if (!localStorage.getItem(KEYS[key])) save(KEYS[key], SEED[key] || []);
  }
}
initStorage();

const db = {
  get users()    { return load(KEYS.users)    || []; },
  get zones()    { return load(KEYS.zones)    || []; },
  get hydrants() { return load(KEYS.hydrants) || []; },
  get tankers()  { return load(KEYS.tankers)  || []; },
  get drivers()  { return load(KEYS.drivers)  || []; },
  get bookings() { return load(KEYS.bookings) || []; },
  set users(v)    { save(KEYS.users,    v); },
  set zones(v)    { save(KEYS.zones,    v); },
  set hydrants(v) { save(KEYS.hydrants, v); },
  set tankers(v)  { save(KEYS.tankers,  v); },
  set drivers(v)  { save(KEYS.drivers,  v); },
  set bookings(v) { save(KEYS.bookings, v); },
};

function sessionGet()  { return load(KEYS.session); }
function sessionSet(u) { save(KEYS.session, u); }
function sessionClear(){ localStorage.removeItem(KEYS.session); }
function safeUser(u)   { if (!u) return null; const { password, ...rest } = u; return rest; }

const mockApi = {
  auth: {
    async login(email, password) {
      await delay();
      if (!email || !password) return err('Email and password are required.');
      const user = db.users.find(u => (u.email === email || u.phone === email) && u.password === password);
      if (!user) return err('Invalid credentials.');
      sessionSet(safeUser(user));
      return ok(safeUser(user));
    },
    async logout() { await delay(); sessionClear(); return ok({ message: 'Logged out.' }); },
    async getCurrentUser() {
      await delay();
      const session = sessionGet();
      if (!session) return err('No active session.');
      const user = db.users.find(u => u.id === session.id);
      if (!user) { sessionClear(); return err('Session expired.'); }
      sessionSet(safeUser(user));
      return ok(safeUser(user));
    },
    async register(userData) {
      await delay();
      const { name, cnic, phone, email, password, address, zone } = userData || {};
      if (!name || !cnic || !phone || !email || !password) return err('All fields are required.');
      const users = db.users;
      if (users.find(u => u.email === email))  return err('Email already registered.');
      if (users.find(u => u.cnic  === cnic))   return err('CNIC already registered.');
      if (users.find(u => u.phone === phone))  return err('Phone already registered.');
      const newUser = { id: 'u' + uid(), name, cnic, phone, email, password, address: address || '', zone: zone || null, role: 'customer', subsidyStatus: 'none', subsidyProof: null, monthlyLimit: null, monthlyUsed: 0 };
      db.users = [...users, newUser];
      sessionSet(safeUser(newUser));
      return ok(safeUser(newUser));
    },
  },

  bookings: {
    async getBookings(filters = {}) {
      await delay();
      let list = db.bookings;
      if (filters.customerId) list = list.filter(b => b.customerId === filters.customerId);
      if (filters.zoneId)     list = list.filter(b => b.zoneId     === filters.zoneId);
      if (filters.hydrantId)  list = list.filter(b => b.hydrantId  === filters.hydrantId);
      if (filters.driverId)   list = list.filter(b => b.driverId   === filters.driverId);
      if (filters.status)     list = list.filter(b => b.status     === filters.status);
      if (filters.type)       list = list.filter(b => b.type       === filters.type);
      return ok(list);
    },
    async getBookingById(id) {
      await delay();
      const b = db.bookings.find(b => b.id === id);
      return b ? ok(b) : err('Booking not found.');
    },
    async createBooking(data) {
      await delay();
      const { customerId, hydrantId, zoneId, type, scheduledDate, deliveryAddress, tankerId } = data || {};
      if (!customerId || !hydrantId || !zoneId || !type || !scheduledDate || !deliveryAddress) return err('Missing required fields.');
      if (!['commercial','subsidised'].includes(type)) return err('Invalid type.');
      if (type === 'subsidised') {
        const user = db.users.find(u => u.id === customerId);
        if (!user || user.subsidyStatus !== 'approved') return err('Subsidised bookings require approved subsidy status.');
        if (user.monthlyUsed >= user.monthlyLimit) return err('Monthly subsidy limit reached.');
      }
      const hydrant = db.hydrants.find(h => h.id === hydrantId);
      if (!hydrant) return err('Hydrant not found.');
      let amount = 0;
      if (tankerId) {
        const tanker = db.tankers.find(t => t.id === tankerId);
        if (tanker) amount = Math.round(tanker.capacityGallons * (type === 'subsidised' ? 0.1 : 0.9));
      }
      const booking = { id: 'b' + uid(), customerId, hydrantId, tankerId: tankerId || null, driverId: null, zoneId, type, status: type === 'commercial' ? 'approved' : 'pending_approval', paymentStatus: 'pending', amount, createdAt: new Date().toISOString(), scheduledDate, deliveryAddress, confirmedAt: null, notes: data.notes || '' };
      db.bookings = [...db.bookings, booking];
      return ok(booking);
    },
    async updateBookingStatus(id, status, extra = {}) {
      await delay();
      const valid = ['pending_approval','approved','assigned','in_transit','delivered','cancelled','disputed'];
      if (!valid.includes(status)) return err('Invalid status.');
      const bookings = db.bookings;
      const idx = bookings.findIndex(b => b.id === id);
      if (idx === -1) return err('Booking not found.');
      bookings[idx] = { ...bookings[idx], status, ...extra };
      db.bookings = bookings;
      return ok(bookings[idx]);
    },
    async cancelBooking(id) {
      await delay();
      const bookings = db.bookings;
      const idx = bookings.findIndex(b => b.id === id);
      if (idx === -1) return err('Booking not found.');
      if (!['pending_approval','approved','assigned'].includes(bookings[idx].status)) return err('Cannot cancel this booking.');
      bookings[idx] = { ...bookings[idx], status: 'cancelled' };
      db.bookings = bookings;
      return ok(bookings[idx]);
    },
    async confirmDelivery(id) {
      await delay();
      const bookings = db.bookings;
      const idx = bookings.findIndex(b => b.id === id);
      if (idx === -1) return err('Booking not found.');
      if (bookings[idx].status !== 'in_transit') return err('Can only confirm in-transit deliveries.');
      bookings[idx] = { ...bookings[idx], status: 'delivered', paymentStatus: 'paid', confirmedAt: new Date().toISOString() };
      db.bookings = bookings;
      return ok(bookings[idx]);
    },
    async disputeDelivery(id, reason) {
      await delay();
      if (!reason) return err('Reason required.');
      const bookings = db.bookings;
      const idx = bookings.findIndex(b => b.id === id);
      if (idx === -1) return err('Booking not found.');
      bookings[idx] = { ...bookings[idx], status: 'disputed', notes: reason };
      db.bookings = bookings;
      return ok(bookings[idx]);
    },
  },

  zones: {
    async getZones() { await delay(); return ok(db.zones); },
    async getZoneById(id) { await delay(); const z = db.zones.find(z => z.id === id); return z ? ok(z) : err('Zone not found.'); },
  },

  hydrants: {
    async getHydrants(zoneId = null) { await delay(); let list = db.hydrants; if (zoneId) list = list.filter(h => h.zoneId === zoneId); return ok(list); },
    async getHydrantById(id) { await delay(); const h = db.hydrants.find(h => h.id === id); return h ? ok(h) : err('Hydrant not found.'); },
    async updateHydrantQuota(id, gallonsUsed) {
      await delay();
      const hydrants = db.hydrants;
      const idx = hydrants.findIndex(h => h.id === id);
      if (idx === -1) return err('Hydrant not found.');
      const remaining = hydrants[idx].remainingQuota - gallonsUsed;
      if (remaining < 0) return err('Insufficient quota.');
      hydrants[idx] = { ...hydrants[idx], remainingQuota: remaining };
      db.hydrants = hydrants;
      return ok(hydrants[idx]);
    },
  },

  tankers: {
    async getTankers(hydrantId = null) { await delay(); let list = db.tankers; if (hydrantId) list = list.filter(t => t.hydrantId === hydrantId); return ok(list); },
    async getTankerById(id) { await delay(); const t = db.tankers.find(t => t.id === id); return t ? ok(t) : err('Tanker not found.'); },
    async updateTankerAvailability(id, available) {
      await delay();
      const tankers = db.tankers;
      const idx = tankers.findIndex(t => t.id === id);
      if (idx === -1) return err('Tanker not found.');
      tankers[idx] = { ...tankers[idx], available };
      db.tankers = tankers;
      return ok(tankers[idx]);
    },
  },

  drivers: {
    async getDrivers() { await delay(); return ok(db.drivers); },
    async getDriverById(id) { await delay(); const d = db.drivers.find(d => d.id === id); return d ? ok(d) : err('Driver not found.'); },
    async updateDriverTrip(id, status, reason = '') {
      await delay();
      const drivers = db.drivers;
      const idx = drivers.findIndex(d => d.id === id);
      if (idx === -1) return err('Driver not found.');
      drivers[idx] = { ...drivers[idx], available: status === 'end', tripNote: reason };
      db.drivers = drivers;
      return ok(drivers[idx]);
    },
  },

  users: {
    async getUsers(role = null) { await delay(); let list = db.users; if (role) list = list.filter(u => u.role === role); return ok(list.map(safeUser)); },
    async getUserById(id) { await delay(); const u = db.users.find(u => u.id === id); return u ? ok(safeUser(u)) : err('User not found.'); },
    async updateSubsidyStatus(id, status) {
      await delay();
      if (!['none','pending','approved'].includes(status)) return err('Invalid status.');
      const users = db.users;
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return err('User not found.');
      users[idx] = { ...users[idx], subsidyStatus: status };
      if (status === 'approved' && !users[idx].monthlyLimit) users[idx].monthlyLimit = 5000;
      db.users = users;
      const session = sessionGet();
      if (session && session.id === id) sessionSet(safeUser(users[idx]));
      return ok(safeUser(users[idx]));
    },
    async applyForSubsidy(id, proofData) {
      await delay();
      if (!proofData) return err('Proof data required.');
      const users = db.users;
      const idx = users.findIndex(u => u.id === id);
      if (idx === -1) return err('User not found.');
      if (users[idx].subsidyStatus === 'approved') return err('Already approved.');
      users[idx] = { ...users[idx], subsidyStatus: 'pending', subsidyProof: proofData };
      db.users = users;
      const session = sessionGet();
      if (session && session.id === id) sessionSet(safeUser(users[idx]));
      return ok(safeUser(users[idx]));
    },
  },

  admin: {
    async getDashboardStats() {
      await delay();
      const bookings = db.bookings;
      const users    = db.users;
      const tankers  = db.tankers;
      const hydrants = db.hydrants;
      return ok({
        totalBookings:     bookings.length,
        activeBookings:    bookings.filter(b => ['approved','assigned','in_transit'].includes(b.status)).length,
        deliveredBookings: bookings.filter(b => b.status === 'delivered').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        disputedBookings:  bookings.filter(b => b.status === 'disputed').length,
        pendingApprovals:  bookings.filter(b => b.status === 'pending_approval').length,
        totalRevenue:      bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0),
        totalCustomers:    users.filter(u => u.role === 'customer').length,
        subsidyPending:    users.filter(u => u.subsidyStatus === 'pending').length,
        availableTankers:  tankers.filter(t => t.available).length,
        totalTankers:      tankers.length,
        quotaUtilisation:  hydrants.map(h => ({ id: h.id, name: h.name, pctUsed: Math.round((1 - h.remainingQuota / h.dailyQuotaGallons) * 100) })),
      });
    },
    async getReports(filters = {}) {
      await delay();
      let bookings = db.bookings;
      if (filters.zoneId)    bookings = bookings.filter(b => b.zoneId    === filters.zoneId);
      if (filters.hydrantId) bookings = bookings.filter(b => b.hydrantId === filters.hydrantId);
      if (filters.type)      bookings = bookings.filter(b => b.type      === filters.type);
      if (filters.status)    bookings = bookings.filter(b => b.status    === filters.status);
      const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + (b.amount || 0), 0);
      const byStatus = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});
      const byType   = bookings.reduce((acc, b) => { acc[b.type]   = (acc[b.type]   || 0) + 1; return acc; }, {});
      return ok({ bookings, totalRevenue, byStatus, byType, count: bookings.length });
    },
  },

  resetData() {
    for (const key of Object.keys(KEYS)) {
      if (key === 'session') { sessionClear(); continue; }
      save(KEYS[key], SEED[key] || []);
    }
    console.log('[PaaniLink] Data reset to seed.');
  },
};

window.mockApi = mockApi;
