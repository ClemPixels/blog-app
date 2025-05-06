// components/ConfirmModal.jsx
import React from "react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  thumbnail,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title || "Are you sure?"}</h3>
        <div className="confirm-modal-thumbnail">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt="Post Thumbnail"
              className="modal-thumbnail"
            />
          ) : (
            <p>No Thumbnail</p>
          )}
        </div>

        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn danger" onClick={onConfirm}>
            Confirm
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
