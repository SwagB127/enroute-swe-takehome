import { useState, useEffect } from "react";
import type { Vehicle, CheckItem, CheckItemKey, ErrorResponse } from "./types";
import { api } from "./api";
import type { ToastType } from "./Toast";


const CHECK_ITEMS: CheckItemKey[] = [
  "TYRES",
  "BRAKES",
  "LIGHTS",
  "OIL",
  "COOLANT",
];

interface Props {
  onSuccess: () => void;
  showToast: (message: string, type: ToastType) => void;
  // TODO: Add showToast prop to display toast notifications
}

export function CheckForm({ onSuccess, showToast }: Props) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [odometerKm, setOdometerKm] = useState("");
  const [items, setItems] = useState<CheckItem[]>(
    CHECK_ITEMS.map((key) => ({ key, status: "OK" as const })),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    api.getVehicles().then(setVehicles).catch(console.error);
  }, []);

  const handleItemStatusChange = (key: CheckItemKey, status: "OK" | "FAIL") => {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, status } : item)),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors([]);
    setLoading(true);

    try {
      // TODO: Include note in the API request
      await api.createCheck({
        vehicleId: selectedVehicle,
        odometerKm: parseFloat(odometerKm),
        items,
        note: note.trim() ? note.trim() : undefined,
      });
      showToast("Check submitted successfully!", "success");

      // Reset form and display success notification
      setSelectedVehicle("");
      setOdometerKm("");
      setNote("");
      setItems(CHECK_ITEMS.map((key) => ({ key, status: "OK" as const })));
      onSuccess();
    } catch (err: unknown) {
      const errorResponse = err as ErrorResponse;
      // TODO: Show error toast notification if got error
      if (errorResponse.error?.details) {
        const messages = errorResponse.error.details.map((d) => `${d.field}: ${d.reason}`);
        setValidationErrors(messages);
        showToast(`Validation error: ${messages.join(", ")}`, "error");
      } else {
        setError("Failed to submit check. Please try again.");
        showToast("Failed to submit check. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="check-form">
      <h2>Submit Vehicle Inspection Result</h2>

      {error && <div className="error-banner">{error}</div>}
      {validationErrors.length > 0 && (
        <div className="error-banner">
          <strong>Validation errors:</strong>
          <ul>
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="vehicle">Vehicle *</label>
        <select
          id="vehicle"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          required>
          <option value="">Select a vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.registration} - {v.make} {v.model} ({v.year})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="odometer">Odometer (km) *</label>
        <input
          id="odometer"
          type="number"
          step="any"
          value={odometerKm}
          onChange={(e) => setOdometerKm(e.target.value)}
          placeholder="Enter odometer reading"
          required
        />
      </div>

      <div className="form-group">
        <label>Checklist Items *</label>
        <div className="checklist">
          {items.map((item) => (
            <div key={item.key} className="checklist-item">
              <span className="item-label">{item.key}</span>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name={item.key}
                    checked={item.status === "OK"}
                    onChange={() => handleItemStatusChange(item.key, "OK")}
                  />
                  OK
                </label>
                <label>
                  <input
                    type="radio"
                    name={item.key}
                    checked={item.status === "FAIL"}
                    onChange={() => handleItemStatusChange(item.key, "FAIL")}
                  />
                  FAIL
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TODO: Add a notes textarea field here (optional, max 300 characters) */}

      <div className="form-group">
  <label htmlFor="note">Notes (optional)</label>
  <textarea
    id="note"
    value={note}
    onChange={(e) => setNote(e.target.value)}
    placeholder="Add notes (max 300 characters)"
    rows={4}
    maxLength={300}
  />
  <div className="char-counter">{note.length}/300</div>
</div>


      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Check"}
      </button>
    </form>
  );
}
