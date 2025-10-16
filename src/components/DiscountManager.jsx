import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

// Reusable Modal
export function DiscountModal({ show, onHide, onSave }) {
  const [discount, setDiscount] = useState("");

  const handleSave = () => {
    if (!discount) return;

    // Trigger parent save handler
    onSave(discount);

    // Reset & close
    setDiscount("");
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="md"
      aria-labelledby="discount-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="discount-modal">Update Discount</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Discount Percentage</Form.Label>
            <Form.Control
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="Enter discount (0 - 100)"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

// Example usage in a component
