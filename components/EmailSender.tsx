"use client";
import { useState } from "react";

export default function EmailSender() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState({
    total: 0,
    sent: 0,
    failed: 0,
  });
  const [image, setImage] = useState<File | null>(null);
  const [failedEmails, setFailedEmails] = useState<
    Array<{ email: string; error: string }>
  >([]);

  const handleUpload = async () => {
    if (!csvFile || !message || !subject || !senderEmail) {
      alert("Please fill all required fields");
      return;
    }

    setIsLoading(true);
    setProgress({ total: 0, sent: 0, failed: 0 });
    setFailedEmails([]);

    try {
      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("message", message);
      formData.append("subject", subject);
      formData.append("senderName", senderName);
      formData.append("senderEmail", senderEmail);
      formData.append("replyTo", replyTo || senderEmail);
      if (image) formData.append("image", image);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setProgress({
          total: data.stats.total,
          sent: data.stats.successful,
          failed: data.stats.failed,
        });
        setFailedEmails(data.failedRecipients || []);
      } else {
        throw new Error(data.error || "Failed to send emails");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[91.5vh] lg:w-1/2 w-full">
      <div className="p-5 w-full max-w-2xl border rounded-lg mx-5 shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Bulk Email Sender
        </h1>

        <div className="space-y-4">
          {/* CSV Upload */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">CSV File*</span>
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full"
              disabled={isLoading}
            />
            <p className="text-xs mt-1 text-gray-500">
              CSV should contain email and optional name columns
            </p>
          </div>

          {/* Sender Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sender Name</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Company"
                className="input input-bordered w-full"
                disabled={isLoading}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Sender Email*</span>
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="your@email.com"
                className="input input-bordered w-full"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Reply To */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Reply-To Email</span>
            </label>
            <input
              type="email"
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
              placeholder="reply@email.com"
              className="input input-bordered w-full"
              disabled={isLoading}
            />
          </div>

          {/* Email Subject */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Subject*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Important Announcement"
              className="input input-bordered w-full"
              disabled={isLoading}
              required
            />
          </div>

          {/* Email Image */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Header Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="file-input file-input-bordered w-full"
              disabled={isLoading}
            />
          </div>
          {/* Email Message */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Body Message*</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your email content here..."
              disabled={isLoading}
            />
          </div>

          {/* Progress */}
          {isLoading && (
            <div className="space-y-2">
              <progress
                className="progress progress-primary w-full"
                value={progress.sent}
                max={progress.total}></progress>
              <p className="text-sm text-center">
                Sending {progress.sent}/{progress.total} emails...
              </p>
            </div>
          )}

          {/* Results */}
          {!isLoading && progress.total > 0 && (
            <div className="alert alert-info">
              <div>
                <h3 className="font-bold">Email Report</h3>
                <p>Total: {progress.total}</p>
                <p>Success: {progress.sent}</p>
                <p>Failed: {progress.failed}</p>
                {failedEmails.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer">
                      Show failed emails
                    </summary>
                    <ul className="list-disc pl-5 mt-2">
                      {failedEmails.map((item, index) => (
                        <li key={index}>
                          {item.email}: {item.error}
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleUpload}
            className={`btn w-full mt-4 ${
              isLoading ? "loading" : ""
            }`}
            disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Emails"}
          </button>
        </div>
      </div>
    </div>
  );
}
