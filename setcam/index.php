<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SETCAM - Smoke Emission Test Center</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container header-container">
            <div class="logo">SETCAM</div>
            <nav>
                <ul>
                    <li><a href="#" class="nav-link active" data-page="home">Home</a></li>
                    <li><a href="#" class="nav-link" data-page="services">Services</a></li>
                    <li><a href="#" class="nav-link" data-page="about">About Us</a></li>
                    <li><a href="#" class="nav-link" data-page="contact">Contact</a></li>
                    
                    <!-- Login/Logout will be toggled by JavaScript -->
                    <li id="auth-menu-item">
                        <a href="#" id="login-btn">Login</a>
                    </li>
                    
                    <!-- User menus (hidden by default) -->
                    <li class="user-menu" style="display:none;"><a href="#" class="nav-link" data-page="appointments">My Appointments</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Home Page -->
    <section id="home" class="page active">
        <!-- Hero Section -->
        <div class="hero">
            <div class="container">
                <h1>Welcome to Smoke Emission Test Center Appointment in Mintal</h1>
                <p>Your trusted partner in vehicle emission compliance</p>
                <a href="#" class="btn" id="appointment-btn">Book Appointment</a>
            </div>
        </div>

        <!-- Services Section -->
        <div class="services">
            <div class="container">
                <h2 class="section-title">Our Services</h2>
                <div class="services-grid">
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-tools"></i></div>
                        <h3>Professional Testing</h3>
                        <p>State-of-the-art equipment and certified technicians</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-bolt"></i></div>
                        <h3>Quick Service</h3>
                        <p>Fast and efficient testing process center</p>
                    </div>
                    <div class="service-card">
                        <div class="service-icon"><i class="fas fa-certificate"></i></div>
                        <h3>Certified Results</h3>
                        <p>Government-accredited emission testing</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Page -->
    <section id="services" class="page">
        <div class="container">
            <h2 class="section-title">Our Premium Services</h2>
            
            <div class="pricing">
                <div class="pricing-grid">
                    <div class="pricing-card" data-vehicle="motorcycles" data-price="500">
                        <div class="service-badge">Most Popular</div>
                        <h3>MOTORCYCLES</h3>
                        <div class="service-icon">
                            <i class="fas fa-motorcycle"></i>
                        </div>
                        <div class="vehicle-type">Private & For Hire</div>
                        <div class="price">Starting at ₱500</div>
                        <ul class="service-features">
                            <li>Comprehensive emission testing</li>
                            <li>Quick 15-minute service</li>
                            <li>Digital certificate</li>
                            <li>Environment compliant</li>
                        </ul>
                        <a href="#" class="btn book-now-btn">Book Now</a>
                    </div>
                    
                    <div class="pricing-card" data-vehicle="4-wheels" data-price="600">
                        <div class="service-badge">Best Value</div>
                        <h3>4 WHEELS</h3>
                        <div class="service-icon">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="vehicle-type">Private & For Hire</div>
                        <div class="price">Starting at ₱600</div>
                        <ul class="service-features">
                            <li>Advanced emission analysis</li>
                            <li>Quick 15-minute service</li>
                            <li>Detailed report</li>
                            <li>LTO compliant</li>
                        </ul>
                        <a href="#" class="btn book-now-btn">Book Now</a>
                    </div>
                    
                    <div class="pricing-card" data-vehicle="6-wheels" data-price="600">
                        <div class="service-badge">Heavy Duty</div>
                        <h3>6 WHEELS & ABOVE</h3>
                        <div class="service-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="vehicle-type">Private & For Hire</div>
                        <div class="price">Starting at ₱600</div>
                        <ul class="service-features">
                            <li>Heavy vehicle testing</li>
                            <li>Commercial grade equipment</li>
                            <li>Quick 15-minute service</li>
                            <li>Bulk discount available</li>
                        </ul>
                        <a href="#" class="btn book-now-btn">Book Now</a>
                    </div>
                </div>
            </div>
            
            <!-- Additional Services Info -->
            <div class="services-info" style="margin-top: 4rem; text-align: center;">
                <div style="background: var(--maroon-bg); padding: 2rem; border-radius: 15px; border-left: 4px solid var(--maroon-primary);">
                    <h3 style="color: var(--maroon-primary); margin-bottom: 1rem;">Why Choose SETCAM?</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
                        <div>
                            <i class="fas fa-bolt" style="color: var(--maroon-primary); font-size: 2rem; margin-bottom: 1rem;"></i>
                            <h4>Fast Service</h4>
                            <p style="color: #666;">Quick and efficient testing process</p>
                        </div>
                        <div>
                            <i class="fas fa-certificate" style="color: var(--maroon-primary); font-size: 2rem; margin-bottom: 1rem;"></i>
                            <h4>Certified</h4>
                            <p style="color: #666;">Government accredited testing center</p>
                        </div>
                        <div>
                            <i class="fas fa-clock" style="color: var(--maroon-primary); font-size: 2rem; margin-bottom: 1rem;"></i>
                            <h4>Flexible Hours</h4>
                            <p style="color: #666;">Open Monday to Saturday</p>
                        </div>
                        <div>
                            <i class="fas fa-shield-alt" style="color: var(--maroon-primary); font-size: 2rem; margin-bottom: 1rem;"></i>
                            <h4>Reliable</h4>
                            <p style="color: #666;">Trusted by thousands of vehicle owners</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Us Page -->
    <section id="about" class="page">
        <div class="container">
            <div class="about">
                <h2 class="section-title">About SETCAM</h2>
                
                <div class="about-content">
                    <div class="about-text">
                        <h3>Your Trusted Emission Testing Partner</h3>
                        <p>SETCAM (Smoke Emission Test Center Appointment in Mintal) has been serving the community with reliable and efficient vehicle emission testing services since 2010. We are committed to helping vehicle owners comply with environmental regulations while ensuring road safety.</p>
                        
                        <p>Our state-of-the-art facility is equipped with the latest emission testing technology and staffed by certified professionals who are dedicated to providing accurate results and excellent customer service.</p>
                        
                        <div class="mission">
                            <h3>Our Mission</h3>
                            <p>To provide accurate, reliable, and efficient emission testing services that help protect our environment while ensuring vehicle compliance with government regulations. We strive to make the testing process convenient and hassle-free for all vehicle owners.</p>
                        </div>
                        
                        <div class="certifications">
                            <h3>Certifications & Accreditations</h3>
                            <ul>
                                <li>Department of Environment and Natural Resources (DENR) Accredited</li>
                                <li>Land Transportation Office (LTO) Certified</li>
                                <li>ISO 9001:2015 Quality Management System</li>
                                <li>Environmental Management Bureau Certified</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="about-image">
                        <div style="background-color: var(--maroon-bg); padding: 2rem; border-radius: 8px; text-align: center; border: 2px solid var(--maroon-primary);">
                            <i class="fas fa-building" style="font-size: 8rem; color: var(--maroon-primary); margin-bottom: 1rem;"></i>
                            <h3>Our Facility</h3>
                            <p>Modern, clean, and equipped with the latest testing technology</p>
                        </div>
                    </div>
                </div>
                
                <div class="team-section" style="margin-top: 4rem;">
                    <h3 class="section-title" style="font-size: 1.8rem;">Our Team</h3>
                    <div class="services-grid">
                        <div class="service-card">
                            <div class="service-icon"><i class="fas fa-user-tie"></i></div>
                            <h3>Certified Technicians</h3>
                            <p>Highly trained and certified emission testing professionals</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon"><i class="fas fa-headset"></i></div>
                            <h3>Customer Service</h3>
                            <p>Friendly and knowledgeable staff ready to assist you</p>
                        </div>
                        <div class="service-card">
                            <div class="service-icon"><i class="fas fa-chart-line"></i></div>
                            <h3>Quality Assurance</h3>
                            <p>Dedicated team ensuring accurate and reliable results</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Page -->
    <section id="contact" class="page">
        <div class="container">
            <h2 class="section-title">Contact Us</h2>
            
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Get In Touch</h3>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div>
                            <h4>Address</h4>
                            <p>Mintal Road, Davao City<br>Philippines 8000</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div>
                            <h4>Phone</h4>
                            <p>(082) 123-4567<br>0912-345-6789</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>info@setcam.com<br>appointments@setcam.com</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div>
                            <h4>Business Hours</h4>
                            <p>Monday - Friday: 8:00 AM - 5:00 PM<br>Saturday: 8:00 AM - 12:00 PM<br>Sunday: Closed</p>
                        </div>
                    </div>
                    
                    <div class="contact-item">
                        <div class="contact-icon">
                            <i class="fas fa-car"></i>
                        </div>
                        <div>
                            <h4>Walk-in Services</h4>
                            <p>Walk-in customers are welcome during business hours. For faster service, we recommend booking an appointment online.</p>
                        </div>
                    </div>
                </div>
                
                <div class="contact-form">
                    <h3>Send us a Message</h3>
                    <form id="contact-form">
                        <div class="form-group">
                            <label for="contact-name">Full Name</label>
                            <input type="text" id="contact-name" placeholder="Enter your full name" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-email">Email Address</label>
                            <input type="email" id="contact-email" placeholder="Enter your email" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-phone">Phone Number</label>
                            <input type="text" id="contact-phone" placeholder="Enter your phone number">
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-subject">Subject</label>
                            <input type="text" id="contact-subject" placeholder="Enter subject" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="contact-message">Message</label>
                            <textarea id="contact-message" placeholder="Enter your message" rows="5" required></textarea>
                        </div>
                        
                        <button type="submit" class="btn" style="width: 100%;">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Authentication Page -->
    <section id="auth" class="page">
        <div class="container auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <div class="auth-logo">SETCAM</div>
                    <h2>Welcome to SETCAM</h2>
                    <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                        <strong>Admin Quick Access:</strong> Press <kbd>Ctrl + A</kbd> to auto-fill admin credentials
                    </p>
                </div>
                
                <div class="auth-tabs">
                    <div class="auth-tab active" data-tab="login">Login</div>
                    <div class="auth-tab" data-tab="signup">Sign Up</div>
                </div>
                
                <!-- Login Form -->
                <form id="login-form" class="auth-form active">
                    <div class="form-group">
                        <label for="login-email">Email</label>
                        <input type="email" id="login-email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="login-password">Password</label>
                        <input type="password" id="login-password" placeholder="Enter your password" required>
                    </div>
                    <button type="button" class="btn" id="login-button" style="width:100%;">Login</button>
                </form>
                
                <!-- Sign Up Form -->
                <form id="signup-form" class="auth-form">
                    <div class="form-group">
                        <label for="signup-fullname">Full Name</label>
                        <input type="text" id="signup-fullname" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-email">Email</label>
                        <input type="email" id="signup-email" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-password">Password</label>
                        <input type="password" id="signup-password" placeholder="Create a password" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-confirm">Confirm Password</label>
                        <input type="password" id="signup-confirm" placeholder="Confirm your password" required>
                    </div>
                    <button type="button" class="btn" id="signup-button" style="width:100%;">Create Account</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Appointment Form Page -->
    <section id="appointment-form" class="page">
        <div class="container">
            <h2 class="section-title">Schedule Appointment</h2>
            
            <div class="appointment-form">
                <h3 class="form-title" id="appointment-vehicle-type">Appointment for MOTORCYCLES</h3>
                
                <form id="appointment-booking-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="owner-name">Owner's Name</label>
                            <input type="text" id="owner-name" placeholder="Enter owner's name" required>
                        </div>
                        <div class="form-group">
                            <label for="contact-number">Contact Number</label>
                            <input type="text" id="contact-number" placeholder="Enter contact number" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="plate-number">Plate Number</label>
                            <input type="text" id="plate-number" placeholder="Enter plate number" required>
                        </div>
                        <div class="form-group">
                            <label for="vehicle-make">Vehicle Make</label>
                            <input type="text" id="vehicle-make" placeholder="Enter vehicle make" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="vehicle-model">Vehicle Model</label>
                            <input type="text" id="vehicle-model" placeholder="Enter vehicle model" required>
                        </div>
                        <div class="form-group">
                            <label for="year">Year</label>
                            <input type="number" id="year" placeholder="Enter year" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="preferred-date">Preferred Date</label>
                            <input type="date" id="preferred-date" required>
                        </div>
                        <div class="form-group">
                            <label for="preferred-time">Preferred Time</label>
                            <select id="preferred-time" required>
                                <option value="08:00">08:00 AM</option>
                                <option value="09:00">09:00 AM</option>
                                <option value="10:00">10:00 AM</option>
                                <option value="11:00">11:00 AM</option>
                                <option value="13:00">01:00 PM</option>
                                <option value="14:00">02:00 PM</option>
                                <option value="15:00">03:00 PM</option>
                                <option value="16:00">04:00 PM</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" id="back-to-services">Back</button>
                        <button type="button" class="btn" id="proceed-to-payment">Proceed to Payment</button>
                    </div>
                </form>
            </div>
        </div>
    </section>

    <!-- GCash Payment Page -->
    <section id="gcash-payment" class="page">
        <div class="container">
            <div class="payment-container">
                <div class="payment-header">
                    <h2>Complete Your Payment</h2>
                    <p>Choose your preferred payment method</p>
                </div>
                
                <!-- Appointment Summary -->
                <div class="appointment-summary-card">
                    <h3>Appointment Summary</h3>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <span class="summary-label">Vehicle Type:</span>
                            <span id="payment-vehicle-type">motorcycles</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Date:</span>
                            <span id="payment-date">2025-04-06</span>
                        </div>
                        <div class="summary-item">
                            <span class="summary-label">Time:</span>
                            <span id="payment-time">08:00 AM</span>
                        </div>
                        <div class="summary-item total">
                            <span class="summary-label">Total Amount:</span>
                            <span class="total-amount">₱<span id="payment-amount">500</span></span>
                        </div>
                    </div>
                    <div class="reference-number">
                        Reference: <span id="payment-reference">EMI-174359454785</span>
                    </div>
                    
                    <!-- Refund Policy Moved Here -->
                    <div class="refund-policy" style="margin-top: 1.5rem;">
                        <div class="policy-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="policy-content">
                            <h4>No Refund Policy</h4>
                            <p>Payments are non-refundable. Please make sure you are committed to the appointment before making a payment.</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Methods -->
                <div class="payment-methods">
                    <!-- GCash Method -->
                    <div class="payment-method-card active">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fas fa-mobile-alt"></i>
                                <span>GCash</span>
                            </div>
                            <div class="method-check">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="method-details">
                            <div class="account-info">
                                <div class="info-item">
                                    <span class="info-label">Account Name:</span>
                                    <span class="info-value">SETCAM Emission Center</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">GCash Number:</span>
                                    <span class="info-value">0917 123 4567</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Amount:</span>
                                    <span class="info-value">₱<span id="gcash-amount">500</span></span>
                                </div>
                            </div>
                            <div class="payment-instructions">
                                <h4>Payment Instructions:</h4>
                                <ol>
                                    <li>Open your GCash app</li>
                                    <li>Go to "Send Money"</li>
                                    <li>Enter the GCash number above</li>
                                    <li>Input the exact amount</li>
                                    <li>Add your reference number in the message</li>
                                    <li>Complete the transaction</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <!-- Bank Transfer Method -->
                    <div class="payment-method-card">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fas fa-university"></i>
                                <span>Bank Transfer</span>
                            </div>
                            <div class="method-check">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="method-details">
                            <div class="account-info">
                                <div class="info-item">
                                    <span class="info-label">Bank Name:</span>
                                    <span class="info-value">BPI (Bank of the Philippine Islands)</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Account Name:</span>
                                    <span class="info-value">SETCAM Emission Center</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Account Number:</span>
                                    <span class="info-value">1234 5678 9012</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Amount:</span>
                                    <span class="info-value">₱<span id="bank-amount">500</span></span>
                                </div>
                            </div>
                            <div class="payment-instructions">
                                <h4>Payment Instructions:</h4>
                                <ol>
                                    <li>Log in to your bank's online platform</li>
                                    <li>Go to "Transfer Funds"</li>
                                    <li>Enter the bank details above</li>
                                    <li>Input the exact amount</li>
                                    <li>Add your reference number in the remarks</li>
                                    <li>Confirm the transaction</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <!-- Over-the-Counter Method -->
                    <div class="payment-method-card">
                        <div class="method-header">
                            <div class="method-logo">
                                <i class="fas fa-store"></i>
                                <span>Over-the-Counter</span>
                            </div>
                            <div class="method-check">
                                <i class="fas fa-check-circle"></i>
                            </div>
                        </div>
                        <div class="method-details">
                            <div class="account-info">
                                <div class="info-item">
                                    <span class="info-label">Payment Centers:</span>
                                    <span class="info-value">Bayad Center, Cebuana, Palawan</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Account Name:</span>
                                    <span class="info-value">SETCAM Emission Center</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Amount:</span>
                                    <span class="info-value">₱<span id="otc-amount">500</span></span>
                                </div>
                            </div>
                            <div class="payment-instructions">
                                <h4>Payment Instructions:</h4>
                                <ol>
                                    <li>Visit any authorized payment center</li>
                                    <li>Provide the account name above</li>
                                    <li>Pay the exact amount</li>
                                    <li>Keep the receipt as proof of payment</li>
                                    <li>Upload the receipt in the next step</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="form-actions" style="margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" id="back-to-appointment-form">
                        <i class="fas fa-arrow-left"></i> Back to Appointment
                    </button>
                    <button class="btn btn-success payment-confirm-btn" id="payment-completed">
                        <i class="fas fa-check-circle"></i> I've Completed the Payment - Upload Receipt
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Upload Receipt Page -->
    <section id="upload-receipt" class="page">
        <div class="container">
            <div class="upload-receipt">
                <div class="upload-header">
                    <h2 class="section-title">Upload Payment Receipt</h2>
                    <button type="button" class="btn btn-secondary" id="back-to-payment">
                        <i class="fas fa-arrow-left"></i> Back to Payment
                    </button>
                </div>
                
                <div class="receipt-upload-section">
                    <div class="upload-instructions">
                        <h3>Instructions:</h3>
                        <ul>
                            <li>Take a clear photo of your payment receipt</li>
                            <li>Make sure the receipt shows the amount and reference number</li>
                            <li>Upload the image file (JPG, PNG, or PDF)</li>
                            <li>Admin will verify your payment before approving the appointment</li>
                        </ul>
                    </div>
                    
                    <div class="upload-area" id="upload-area">
                        <div class="upload-content">
                            <i class="fas fa-cloud-upload-alt" style="font-size: 3rem; color: #007bff; margin-bottom: 1rem;"></i>
                            <h3>Drag & Drop your receipt here</h3>
                            <p>or</p>
                            <button class="btn btn-primary" id="select-file-btn">Choose File</button>
                            <input type="file" id="receipt-file" accept="image/*,.pdf" style="display: none;">
                        </div>
                    </div>
                    
                    <div class="file-preview" id="file-preview" style="display: none;">
                        <h4>Selected File:</h4>
                        <div class="preview-content">
    <div class="preview-image-container">
        <img id="preview-image" class="clickable-image" onclick="openImagePreview(this.src)">
        <div class="preview-overlay" onclick="openImagePreview(document.getElementById('preview-image').src)">
            <i class="fas fa-search-plus"></i>
            Click to view larger
        </div>
    </div>
    <div class="file-info">
                                <p><strong>File:</strong> <span id="file-name"></span></p>
                                <p><strong>Size:</strong> <span id="file-size"></span></p>
                                <p><strong>Type:</strong> <span id="file-type"></span></p>
                            </div>
                        </div>
                        
                        <div class="confirmation-checkbox" id="confirmation-checkbox">
                            <label class="checkbox-label">
                                <input type="checkbox" id="receipt-confirm">
                                <span class="checkmark"></span>
                                I confirm that this receipt shows the correct payment amount and reference number
                            </label>
                        </div>
                        
                        <div class="file-actions">
                            <button class="btn btn-success" id="upload-receipt-btn" disabled>
                                <i class="fas fa-upload"></i> Upload Receipt
                            </button>
                            <button class="btn btn-secondary" id="change-file-btn">
                                <i class="fas fa-times"></i> Change File
                            </button>
                        </div>
                    </div>
                    
                    <div class="upload-status" id="upload-status" style="display: none;">
                        <div class="status-message">
                            <i class="fas fa-check-circle" style="color: #28a745; font-size: 3rem; margin-bottom: 1rem;"></i>
                            <h3>Receipt Uploaded Successfully!</h3>
                            <p>Your payment receipt has been uploaded. Please wait for admin verification.</p>
                            <p>You will receive a notification once your appointment is confirmed.</p>
                            <button class="btn btn-success" id="back-to-home-btn" style="margin-top: 1rem;">
                                <i class="fas fa-home"></i> Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Admin Dashboard Page -->
    <section id="admin" class="page">
        <div class="container admin-dashboard">
            <div class="admin-header">
                <div>
                    <h2 class="section-title">Admin Dashboard</h2>
                    <p>Manage appointments, users, and system analytics</p>
                </div>
                <div class="admin-actions">
                    <button class="btn btn-secondary" id="refresh-admin-btn">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                    <button class="btn">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions">
                <div class="quick-action-card" data-tab="appointments">
                    <div class="quick-action-icon">
                        <i class="fas fa-calendar-check"></i>
                    </div>
                    <h4>Appointments</h4>
                    <p>Manage bookings</p>
                </div>
                <div class="quick-action-card" data-tab="users">
                    <div class="quick-action-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h4>Users</h4>
                    <p>User management</p>
                </div>
                <div class="quick-action-card" data-tab="analytics">
                    <div class="quick-action-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h4>Analytics</h4>
                    <p>View reports</p>
                </div>
                <div class="quick-action-card" data-tab="settings">
                    <div class="quick-action-icon">
                        <i class="fas fa-cog"></i>
                    </div>
                    <h4>Settings</h4>
                    <p>System config</p>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="admin-stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="total-appointments">0</div>
                    <div class="stat-label">Total Appointments</div>
                    <div class="stat-trend trend-up">+12% this week</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="pending-approvals">0</div>
                    <div class="stat-label">Pending Approval</div>
                    <div class="stat-trend trend-up">+5 today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-users">0</div>
                    <div class="stat-label">Registered Users</div>
                    <div class="stat-trend trend-up">+3 today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="revenue-today">₱0</div>
                    <div class="stat-label">Revenue Today</div>
                    <div class="stat-trend trend-up">+8% from yesterday</div>
                </div>
            </div>

            <!-- Admin Tabs -->
            <div class="admin-tabs">
                <button class="admin-tab active" data-tab="appointments">
                    <i class="fas fa-calendar-alt"></i> Appointments
                </button>
                <button class="admin-tab" data-tab="users">
                    <i class="fas fa-users"></i> Users
                </button>
                <button class="admin-tab" data-tab="analytics">
                    <i class="fas fa-chart-bar"></i> Analytics
                </button>
                <button class="admin-tab" data-tab="settings">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>

            <!-- Appointments Tab -->
            <div class="admin-tab-content active" id="appointments-tab">
                <div class="admin-card">
                    <div class="admin-card-header">
                        <h3 class="admin-card-title">Appointment Management</h3>
                        <div class="admin-filters">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" id="appointment-search" placeholder="Search appointments...">
                            </div>
                            <select class="filter-select" id="status-filter">
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="pending_approval">Pending Approval</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="rejected">Rejected</option>
                            </select>
                            <select class="filter-select" id="date-filter">
                                <option value="">All Dates</option>
                                <option value="today">Today</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>
                    </div>

                    <div id="admin-appointments-list">
                        <!-- Appointments will be loaded here by JavaScript -->
                    </div>
                </div>
            </div>

            <!-- In the Users Tab section, update the status filter ID -->
<div class="admin-tab-content" id="users-tab">
    <div class="admin-card">
        <div class="admin-card-header">
            <h3 class="admin-card-title">User Management</h3>
            <div class="admin-actions">
                <button class="btn" id="add-user-btn">
                    <i class="fas fa-plus"></i> Add User
                </button>
                <button class="btn btn-secondary" onclick="loadUsersTable()">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>
        
        <!-- User Statistics -->
        <div class="user-stats">
            <div class="user-stat-card">
                <div class="user-stat-number" id="total-users-stat">0</div>
                <div class="user-stat-label">Total Users</div>
            </div>
            <div class="user-stat-card">
                <div class="user-stat-number" id="active-users-stat">0</div>
                <div class="user-stat-label">Active Users</div>
            </div>
            <div class="user-stat-card">
                <div class="user-stat-number" id="admin-users-stat">0</div>
                <div class="user-stat-label">Admin Users</div>
            </div>
            <div class="user-stat-card">
                <div class="user-stat-number" id="verified-users-stat">0</div>
                <div class="user-stat-label">Verified Users</div>
            </div>
        </div>
        
        <!-- User Filters -->
        <div class="user-filters">
            <div class="user-search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="user-search" placeholder="Search users by name, email, or ID...">
            </div>
            <select class="filter-select" id="role-filter">
                <option value="">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
            </select>
            <!-- FIXED: Changed ID to user-status-filter to avoid conflict with appointments filter -->
            <select class="filter-select" id="user-status-filter">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
        </div>

        <div class="user-table-container">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Appointments</th>
                        <th>Joined</th>
                        <th>Email Status</th>
                        <th>Account Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="users-table-body">
                    <!-- Users will be loaded here by JavaScript -->
                </tbody>
            </table>
        </div>
    </div>
</div>

            <!-- Analytics Tab -->
<div class="admin-tab-content" id="analytics-tab">
    <div class="chart-container">
        <div class="chart-header">
            <h3 class="admin-card-title">Revenue Overview</h3>
            <select class="filter-select" id="analytics-period">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
            </select>
        </div>
        <div class="chart-placeholder" id="revenue-chart-container">
            <!-- Chart will be loaded here -->
        </div>
    </div>

    <div class="admin-stats-grid">
        <div class="stat-card">
            <div class="stat-number" id="total-revenue">₱0</div>
            <div class="stat-label">Total Revenue</div>
            <div class="stat-trend trend-up" id="revenue-trend">+0% this week</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="completed-tests">0</div>
            <div class="stat-label">Completed Tests</div>
            <div class="stat-trend trend-up" id="tests-trend">+0 this week</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="success-rate">0%</div>
            <div class="stat-label">Success Rate</div>
            <div class="stat-trend trend-up" id="success-trend">+0% this week</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="customer-rating">0/5</div>
            <div class="stat-label">Customer Rating</div>
            <div class="stat-trend trend-up" id="rating-trend">+0 this week</div>
        </div>
    </div>
</div>

            <!-- Settings Tab -->
            <div class="admin-tab-content" id="settings-tab">
                <div class="admin-card">
                    <h3 class="admin-card-title">System Settings</h3>
                    <div class="settings-grid">
                        <div class="setting-group">
                            <h4>Business Hours</h4>
                            <div class="time-settings">
                                <div class="time-range">
                                    <label>Opening Time:</label>
                                    <input type="time" id="opening-time" value="08:00" class="filter-select">
                                </div>
                                <div class="time-range">
                                    <label>Closing Time:</label>
                                    <input type="time" id="closing-time" value="17:00" class="filter-select">
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h4>Pricing</h4>
                            <div class="pricing-settings">
                                <div class="price-input">
                                    <label>Motorcycles:</label>
                                    <input type="number" id="motorcycles-price" value="500" class="filter-select" placeholder="₱">
                                </div>
                                <div class="price-input">
                                    <label>4 Wheels:</label>
                                    <input type="number" id="four-wheels-price" value="600" class="filter-select" placeholder="₱">
                                </div>
                                <div class="price-input">
                                    <label>6+ Wheels:</label>
                                    <input type="number" id="six-wheels-price" value="600" class="filter-select" placeholder="₱">
                                </div>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h4>Notifications</h4>
                            <div class="notification-settings">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="email-notifications" checked> Email notifications for new appointments
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="settings-actions">
                        <button class="btn btn-success" id="save-settings-btn">
                            <i class="fas fa-save"></i> Save Settings
                        </button>
                        <button class="btn btn-secondary" id="reset-settings-btn">
                            <i class="fas fa-undo"></i> Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- My Appointments Page -->
    <section id="appointments" class="page">
        <div class="container">
            <h2 class="section-title">My Appointments</h2>
            
            <div class="appointments-list" id="appointments-list">
                <!-- Appointments will be loaded here by JavaScript -->
            </div>
        </div>
    </section>

    <!-- Settings Page -->
    <section id="settings" class="page">
        <div class="container">
            <h2 class="section-title">Settings</h2>
            
            <div class="settings-card">
                <h3>Account Information</h3>
                <div class="user-info" id="user-info">
                    <p><strong>Name:</strong> <span id="user-name">-</span></p>
                    <p><strong>Email:</strong> <span id="user-email">-</span></p>
                    <p><strong>Role:</strong> <span id="user-role">-</span></p>
                    <p><strong>Email Verified:</strong> <span id="user-verified">-</span></p>
                </div>
                
                <div class="settings-actions">
                    <button class="btn btn-danger" id="logout-settings-btn">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2023 SETCAM - Smoke Emission Test Center. All rights reserved.</p>
        </div>
    </footer>

    <!-- Update User Modal -->
    <div id="update-user-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Update User</h3>
                <button class="modal-close" onclick="closeUpdateModal()">&times;</button>
            </div>
            <form id="update-user-form">
                <input type="hidden" id="update-user-id">
                <div class="form-group">
                    <label for="update-fullname">Full Name</label>
                    <input type="text" id="update-fullname" required>
                </div>
                <div class="form-group">
                    <label for="update-email">Email</label>
                    <input type="email" id="update-email" required>
                </div>
                <div class="form-group">
                    <label for="update-role">Role</label>
                    <select id="update-role" required>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="update-password">New Password (leave blank to keep current)</label>
                    <input type="password" id="update-password" placeholder="Enter new password">
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeUpdateModal()">Cancel</button>
                    <button type="submit" class="btn btn-success">Update User</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Email Verification Modal -->
    <div id="email-verification-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Verify Your Email</h3>
                <button class="modal-close" onclick="closeEmailVerification()">&times;</button>
            </div>
            <div class="verification-content">
                <div class="verification-icon">
                    <i class="fas fa-envelope" style="font-size: 3rem; color: var(--maroon-primary); margin-bottom: 1rem;"></i>
                </div>
                <h4>Verification Code Sent!</h4>
                <p>We've sent a 6-digit verification code to your email address:</p>
                <p class="verification-email" id="verification-email"></p>
                <p>Please check your inbox and enter the code below:</p>
                
                <div class="verification-form">
                    <div class="form-group">
                        <label for="verification-code">Verification Code</label>
                        <input type="text" id="verification-code" placeholder="Enter 6-digit code" maxlength="6" required>
                    </div>
                    <div class="verification-actions">
                        <button type="button" class="btn btn-secondary" id="resend-code-btn">
                            <i class="fas fa-redo"></i> Resend Code
                        </button>
                        <button type="button" class="btn btn-success" id="verify-code-btn">
                            <i class="fas fa-check"></i> Verify Email
                        </button>
                    </div>
                    <div class="verification-timer">
                        <p>Code expires in: <span id="countdown-timer">05:00</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Receipt Modal -->
    <div id="receipt-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content receipt-modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Payment Receipt</h3>
                <button class="modal-close" onclick="closeReceiptModal()">&times;</button>
            </div>
            <div class="receipt-content">
                <div class="receipt-info">
                    <p><strong>Reference:</strong> <span id="receipt-reference"></span></p>
                    <p><strong>Vehicle Type:</strong> <span id="receipt-vehicle-type"></span></p>
                    <p><strong>Amount:</strong> ₱<span id="receipt-amount"></span></p>
                    <p><strong>Date:</strong> <span id="receipt-date"></span></p>
                </div>
                <div class="receipt-image-container">
                    <img id="receipt-image" class="receipt-image" src="" alt="Payment Receipt">
                </div>
                <div class="receipt-actions">
                    <button class="btn btn-secondary" onclick="closeReceiptModal()">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Emission Test Modal -->
    <div id="emission-test-modal" class="modal-overlay" style="display: none;">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3 class="modal-title">Emission Test Results</h3>
                <button class="modal-close" onclick="closeEmissionTestModal()">&times;</button>
            </div>
            <div class="emission-test-form">
                <form id="emission-test-form">
                    <input type="hidden" id="emission-appointment-id">
                    
                    <!-- Header Section -->
                    <div class="emission-header" style="text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #800000; padding-bottom: 1rem;">
                        <h2 style="color: #800000; margin: 0;">SMOKE EMISSION TEST CENTER APPOINTMENT IN MINTAL</h2>
                        <p style="margin: 0.5rem 0; font-weight: bold;">Gumannela St., Bigy, Mintal, Davao City</p>
                        <p style="margin: 0; color: #666;">R11-2015-04-1512</p>
                    </div>

                    <!-- Form Fields in Grid Layout -->
                    <div class="emission-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                        <!-- Left Column -->
                        <div class="form-column">
                            <div class="form-group">
                                <label for="test-datetime">Date & Time</label>
                                <input type="datetime-local" id="test-datetime" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="full-name">Full Name</label>
                                <input type="text" id="full-name" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="address">Address</label>
                                <textarea id="address" class="form-control" rows="2" required></textarea>
                            </div>
                            
                            <div class="form-group">
                                <label for="plate-number">Plate Number</label>
                                <input type="text" id="plate-number" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="file-number">File Number</label>
                                <input type="text" id="file-number" class="form-control" required>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="form-column">
                            <div class="form-group">
                                <label for="engine-number">Engine Number</label>
                                <input type="text" id="engine-number" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="chassis-number">Chassis Number</label>
                                <input type="text" id="chassis-number" class="form-control" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="fuel-type">Fuel Type</label>
                                <select id="fuel-type" class="form-control" required>
                                    <option value="">Select Fuel Type</option>
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Diesel">Diesel</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="year-model">Year Model</label>
                                <input type="number" id="year-model" class="form-control" min="1990" max="2025" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="brand-model">Brand/Model</label>
                                <input type="text" id="brand-model" class="form-control" required>
                            </div>
                        </div>
                    </div>

                    <!-- Second Row -->
                    <div class="emission-form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem;">
                        <!-- Left Column -->
                        <div class="form-column">
                            <div class="form-group">
                                <label for="vehicle-type">Vehicle Type</label>
                                <select id="vehicle-type" class="form-control" required>
                                    <option value="">Select Vehicle Type</option>
                                    <option value="Motorcycle">Motorcycle</option>
                                    <option value="Private Car">Private Car</option>
                                    <option value="SUV">SUV</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="color">Color</label>
                                <input type="text" id="color" class="form-control" required>
                            </div>
                        </div>

                        <!-- Right Column -->
                        <div class="form-column">
                            <div class="form-group">
                                <label for="vehicle-classification">Vehicle Classification</label>
                                <select id="vehicle-classification" class="form-control" required>
                                    <option value="">Select Classification</option>
                                    <option value="Private">Private</option>
                                    <option value="For Hire">For Hire</option>
                                    <option value="Government">Government</option>
                                    <option value="Diplomatic">Diplomatic</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label for="validity-expiration">Validity Emission Date Expiration</label>
                                <input type="date" id="validity-expiration" class="form-control" required>
                            </div>
                        </div>
                    </div>

                    <!-- Test Results Section -->
                    <div class="test-results-section" style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                        <h4 style="color: #800000; margin-bottom: 1rem; text-align: center;">EMISSION TEST RESULTS</h4>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label for="co-reading">CO Reading</label>
                                <input type="text" id="co-reading" class="form-control" placeholder="Enter CO reading" required>
                            </div>
                            <div class="form-group">
                                <label for="hc-reading">HC Reading</label>
                                <input type="text" id="hc-reading" class="form-control" placeholder="Enter HC reading" required>
                            </div>
                        </div>
                    </div>

                    <!-- Signatures Section - Blank lines for pen signatures -->
                    <div class="signatures-section" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                        <div class="signature-group">
                            <div class="form-group">
                                <label for="inspector-name">Inspector Name</label>
                                <input type="text" id="inspector-name" class="form-control" required>
                            </div>
                            <div class="signature-line" style="border-top: 1px solid #000; margin-top: 40px; text-align: center; padding-top: 5px;">
                                Inspector Signature
                            </div>
                        </div>
                        <div class="signature-group">
                            <div class="form-group">
                                <label for="owner-name-signature">Owner Name</label>
                                <input type="text" id="owner-name-signature" class="form-control" required>
                            </div>
                            <div class="signature-line" style="border-top: 1px solid #000; margin-top: 40px; text-align: center; padding-top: 5px;">
                                Owner Signature
                            </div>
                        </div>
                    </div>

                    <!-- Result and Action Buttons -->
                    <div class="form-actions" style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #ddd; padding-top: 1rem;">
                        <div>
                            <label class="checkbox-label">
                                <input type="checkbox" id="test-passed" checked>
                                <span class="checkmark"></span>
                                PASSED
                            </label>
                            <label class="checkbox-label" style="margin-left: 1rem;">
                                <input type="checkbox" id="test-failed">
                                <span class="checkmark"></span>
                                FAILED
                            </label>
                        </div>
                        
                        <div style="font-weight: bold; color: #800000;">
                            FOR REGISTRATION
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="form-actions" style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="closeEmissionTestModal()">Cancel</button>
                        <button type="button" class="btn btn-info" onclick="previewEmissionTest()">
                            <i class="fas fa-eye"></i> Preview
                        </button>
                        <button type="button" class="btn btn-success" onclick="saveAndPrintEmissionTest()">
                            <i class="fas fa-save"></i> Save & Print
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    

<!-- Update User Modal (enhanced) -->
<div id="update-user-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Update User</h3>
            <button class="modal-close" onclick="closeUpdateModal()">&times;</button>
        </div>
        <form id="update-user-form">
            <input type="hidden" id="update-user-id">
            <div class="form-group">
                <label for="update-fullname">Full Name</label>
                <input type="text" id="update-fullname" required>
            </div>
            <div class="form-group">
                <label for="update-email">Email</label>
                <input type="email" id="update-email" required>
            </div>
            <div class="form-group">
                <label for="update-role">Role</label>
                <select id="update-role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="update-active">
                    <span class="checkmark"></span>
                    Active User
                </label>
            </div>
            <div class="form-group">
                <label for="update-password">New Password (leave blank to keep current)</label>
                <input type="password" id="update-password" placeholder="Enter new password">
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeUpdateModal()">Cancel</button>
                <button type="submit" class="btn btn-success">Update User</button>
            </div>
        </form>
    </div>
</div>

    <!-- Notification System -->
    <div id="notification-container" class="notification-container"></div>

    <!-- JavaScript -->
    <script src="js/script.js"></script>

    <!-- Add User Modal -->
<div id="add-user-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Add New User</h3>
            <button class="modal-close" onclick="closeAddUserModal()">&times;</button>
        </div>
        <form id="add-user-form">
            <div class="form-group">
                <label for="add-fullname">Full Name *</label>
                <input type="text" id="add-fullname" placeholder="Enter full name" required>
            </div>
            <div class="form-group">
                <label for="add-email">Email *</label>
                <input type="email" id="add-email" placeholder="Enter email address" required>
            </div>
            <div class="form-group">
                <label for="add-password">Password *</label>
                <input type="password" id="add-password" placeholder="Enter password" required>
            </div>
            <div class="form-group">
                <label for="add-role">Role *</label>
                <select id="add-role" required>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="add-active" checked>
                    <span class="checkmark"></span>
                    Active User
                </label>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-secondary" onclick="closeAddUserModal()">Cancel</button>
                <button type="submit" class="btn btn-success">Add User</button>
            </div>
        </form>
    </div>
</div>
<!-- Image Preview Modal -->
<div id="image-preview-modal" class="image-preview-modal">
    <div class="image-preview-content">
        <button class="image-preview-close" onclick="closeImagePreview()">&times;</button>
        <img id="image-preview" src="" alt="Preview">
    </div>
</div>
</body>
</html>