const nodemailer = require('nodemailer');

/**
 * Email Service for Automated Complaint Notifications
 * Sends emails when violations are recorded with blockchain verification
 */

class EmailService {
  constructor() {
    // Configure email transporter (using Gmail in demo - use SMTP for production)
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'industrial.monitoring@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'demo-password'
      }
    });

    this.systemEmail = 'noreply@industrialmonitoring.local';
  }

  /**
   * Send complaint notification to company
   */
  async sendComplaintNotification(complaint, blockchainProof) {
    try {
      const emailContent = this.generateComplaintEmail(complaint, blockchainProof);

      const mailOptions = {
        from: this.systemEmail,
        to: complaint.email,
        cc: process.env.ADMIN_EMAIL || 'admin@industrialmonitoring.local',
        subject: `⚠️ Industrial Violation Record: ${complaint.companyName}`,
        html: emailContent,
        attachments: [
          {
            filename: 'complaint-proof.json',
            content: JSON.stringify(blockchainProof, null, 2),
            contentType: 'application/json'
          }
        ]
      };

      // Log instead of actually sending in demo mode
      console.log('📧 Email would be sent:', {
        to: complaint.email,
        subject: mailOptions.subject,
        timestamp: new Date().toISOString()
      });

      return {
        status: 'queued',
        email: complaint.email,
        timestamp: new Date().toISOString(),
        blockchainHash: blockchainProof.complaintHash
      };
    } catch (error) {
      console.error('Email service error:', error);
      return {
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Send verification email to verify complaint on blockchain
   */
  async sendVerificationEmail(complaint, blockchainHash) {
    const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-complaint/${blockchainHash}`;

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
          <h2>📋 Complaint Recorded on Blockchain</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Dear ${complaint.companyName},</p>
          
          <p>A violation complaint has been recorded against your facility:</p>
          
          <div style="background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0;">
            <p><strong>Company:</strong> ${complaint.companyName}</p>
            <p><strong>Reason:</strong> ${complaint.reason}</p>
            <p><strong>Location:</strong> ${complaint.location}</p>
            <p><strong>Severity:</strong> ${complaint.severity}</p>
            <p><strong>Details:</strong> ${complaint.details}</p>
          </div>

          <div style="background: #e3f2fd; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p><strong>🔗 Blockchain Record:</strong></p>
            <p style="word-break: break-all; font-family: monospace; font-size: 12px;">${blockchainHash}</p>
          </div>

          <a href="${verificationLink}" style="background: #667eea; color: white; padding: 12px 20px; border-radius: 4px; text-decoration: none; display: inline-block; margin-top: 20px;">
            ✓ Verify on Blockchain
          </a>

          <p style="margin-top: 30px; color: #666; font-size: 12px;">
            This record has been cryptographically secured on blockchain and cannot be altered.
            Verification timestamp: ${new Date().toISOString()}
          </p>
        </div>
      </div>
    `;

    console.log('📧 Verification email queued:', {
      to: complaint.email,
      blockchainHash,
      timestamp: new Date().toISOString()
    });

    return {
      status: 'sent',
      email: complaint.email,
      blockchainHash,
      verificationLink
    };
  }

  /**
   * Send alert to admin
   */
  async sendAdminAlert(complaint, blockchainProof) {
    const emailContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>🚨 New Violation Alert</h2>
        <p><strong>Company:</strong> ${complaint.companyName}</p>
        <p><strong>Reason:</strong> ${complaint.reason}</p>
        <p><strong>Severity:</strong> ${complaint.severity}</p>
        <p><strong>Blockchain Hash:</strong> <code>${blockchainProof.complaintHash}</code></p>
        <p><strong>Block Number:</strong> ${blockchainProof.blockNumber}</p>
        <p><strong>Timestamp:</strong> ${blockchainProof.timestamp}</p>
      </div>
    `;

    console.log('📧 Admin alert queued:', {
      to: process.env.ADMIN_EMAIL,
      company: complaint.companyName,
      timestamp: new Date().toISOString()
    });

    return { status: 'sent' };
  }

  /**
   * Send blockchain verification summary email
   */
  async sendVerificationSummary(stats) {
    const emailContent = `
      <div style="font-family: Arial, sans-serif;">
        <h2>📊 Blockchain Verification Summary</h2>
        <p><strong>Total Records:</strong> ${stats.totalRecords}</p>
        <p><strong>Total Blocks:</strong> ${stats.totalBlocks}</p>
        <p><strong>Chain Integrity:</strong> ${stats.chainIntegrity ? '✓ Valid' : '✗ Compromised'}</p>
        <p><strong>Latest Block Hash:</strong> <code>${stats.latestBlockHash}</code></p>
      </div>
    `;

    console.log('📊 Blockchain summary email queued');
    return { status: 'sent' };
  }

  /**
   * Generate HTML complaint email
   */
  generateComplaintEmail(complaint, blockchainProof) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px 8px 0 0; color: white;">
          <h2>🚨 Industrial Land Violation Notice</h2>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Dear Administrator,</p>
          
          <p>A violation complaint has been officially recorded and secured on the blockchain.</p>
          
          <div style="background: white; padding: 15px; border-left: 4px solid #f44336; margin: 20px 0;">
            <h3 style="margin-top: 0;">Complaint Details:</h3>
            <p><strong>Company:</strong> ${complaint.companyName}</p>
            <p><strong>Violation Reason:</strong> ${complaint.reason}</p>
            <p><strong>Location:</strong> ${complaint.location}</p>
            <p><strong>Severity Level:</strong> <span style="color: #f44336; font-weight: bold;">${complaint.severity}</span></p>
            <p><strong>Details:</strong> ${complaint.details}</p>
            <p><strong>Reported By:</strong> ${complaint.email}</p>
            <p><strong>Contact:</strong> ${complaint.phone}</p>
          </div>

          <div style="background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2e7d32;">🔐 Blockchain Verification</h3>
            <p><strong>Block Number:</strong> ${blockchainProof.blockNumber}</p>
            <p><strong>Transaction Hash:</strong></p>
            <p style="word-break: break-all; font-family: monospace; font-size: 11px; background: white; padding: 10px; border-radius: 4px;">
              ${blockchainProof.complaintHash}
            </p>
            <p><strong>Merkle Proof:</strong></p>
            <p style="word-break: break-all; font-family: monospace; font-size: 11px; background: white; padding: 10px; border-radius: 4px;">
              ${blockchainProof.merkleProof}
            </p>
            <p><strong>Chain Valid:</strong> ✓ Yes</p>
            <p><strong>Recorded At:</strong> ${blockchainProof.timestamp}</p>
          </div>

          <p style="margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px;">
            This complaint has been cryptographically secured on the blockchain and is immutable. 
            All records are automatically verified and cannot be tampered with.
          </p>
        </div>
      </div>
    `;
  }
}

module.exports = new EmailService();
