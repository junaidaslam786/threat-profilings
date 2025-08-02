import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreatePaymentIntentMutation,
  useProcessPaymentMutation,
} from "../../Redux/api/paymentsApi";
import {
  setCurrentPaymentIntent,
  clearPaymentState,
} from "../../Redux/slices/paymentsSlice";
import LoadingSpinner from "../../components/Common/LoadingScreen";
import ErrorMessage from "../../components/Common/ErrorMessage";
import { type RootState } from "../../Redux/store";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

interface PaymentFormValues {
  client_name: string;
  amount: number;
  partner_code: string;
  tier: string;
}

const CheckoutForm: React.FC<{ clientName: string; userEmail: string }> = ({
  clientName,
  userEmail,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    createPaymentIntent,
    { isLoading: isCreatingIntent, error: intentError },
  ] = useCreatePaymentIntentMutation();
  const [
    processPayment,
    { isLoading: isProcessingPayment, error: processError },
  ] = useProcessPaymentMutation();

  const currentPaymentIntent = useSelector(
    (state: RootState) => state.payments.currentPaymentIntent
  );

  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const formik = useFormik<PaymentFormValues>({
    initialValues: {
      client_name: clientName,
      amount: 100,
      partner_code: "",
      tier: "L1",
    },
    validationSchema: Yup.object({
      client_name: Yup.string().required("Client Name is required"),
      amount: Yup.number()
        .min(1, "Amount must be at least 1")
        .required("Amount is required"),
      partner_code: Yup.string().optional(),
      tier: Yup.string().required("Tier is required"),
    }),
    onSubmit: async (values) => {
      setPaymentMessage(null);
      setPaymentError(null);

      try {
        const intentResult = await createPaymentIntent({
          amount: values.amount,
          client_name: values.client_name,
          partner_code: values.partner_code || undefined,
        }).unwrap();
        dispatch(setCurrentPaymentIntent(intentResult));
        setPaymentMessage("Payment intent created. Please confirm payment.");
      } catch (err: unknown) {
        setPaymentError(
          err instanceof Error
            ? err.message
            : typeof err === "object" && err !== null && "data" in err
            ? (err as { data?: { message?: string } }).data?.message ||
              "Failed to create payment intent."
            : "Failed to create payment intent."
        );
      }
    },
  });

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentMessage(null);
    setPaymentError(null);

    if (!stripe || !elements || !currentPaymentIntent?.client_secret) {
      setPaymentError("Stripe.js has not loaded or payment intent is missing.");
      return;
    }

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setPaymentError("Card Element not found.");
        return;
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        currentPaymentIntent.client_secret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email: userEmail,
            },
          },
        }
      );

      if (error) {
        setPaymentError(error.message || "Payment confirmation failed.");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        const processResult = await processPayment({
          payment_method_id: paymentIntent.payment_method as string,
          amount: formik.values.amount,
          client_name: formik.values.client_name,
          partner_code: formik.values.partner_code || undefined,
          tier: formik.values.tier,
        }).unwrap();

        setPaymentMessage(
          `Payment successful! Payment ID: ${processResult.payment_id}, Invoice: ${processResult.payment_id}`
        );
        dispatch(clearPaymentState());
        alert("Payment successful! Redirecting to dashboard...");
        navigate("/dashboard");
      } else {
        setPaymentError("Payment not succeeded.");
      }
    } catch (err: unknown) {
      console.error("Payment confirmation failed:", err);
      setPaymentError(
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "data" in err
          ? (err as { data?: { message?: string } }).data?.message ||
            "Payment confirmation failed."
          : "Payment confirmation failed."
      );
    }
  };

  useEffect(() => {
    return () => {
      dispatch(clearPaymentState());
    };
  }, [clientName, dispatch]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Payment Details</h2>

      {paymentError && (
        <ErrorMessage
          message={paymentError}
          onClose={() => setPaymentError(null)}
        />
      )}
      {paymentMessage && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          {paymentMessage}
        </div>
      )}

      {/* Form for creating payment intent */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="client_name"
            className="block text-sm font-medium text-gray-700"
          >
            Client Name:
          </label>
          <input
            id="client_name"
            name="client_name"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.client_name}
            disabled={isCreatingIntent || isProcessingPayment}
          />
          {formik.touched.client_name && formik.errors.client_name && (
            <p className="mt-1 text-sm text-red-600">
              {formik.errors.client_name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount ($):
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.amount}
            disabled={isCreatingIntent || isProcessingPayment}
          />
          {formik.touched.amount && formik.errors.amount && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.amount}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="tier"
            className="block text-sm font-medium text-gray-700"
          >
            Subscription Tier:
          </label>
          <select
            id="tier"
            name="tier"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tier}
            disabled={isCreatingIntent || isProcessingPayment}
          >
            <option value="L0">L0 (Free)</option>{" "}
            {/* Although payment is for L1+, L0 could be a placeholder */}
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
          </select>
          {formik.touched.tier && formik.errors.tier && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.tier}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="partner_code"
            className="block text-sm font-medium text-gray-700"
          >
            Partner Code (Optional):
          </label>
          <input
            id="partner_code"
            name="partner_code"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.partner_code}
            disabled={isCreatingIntent || isProcessingPayment}
            placeholder="Enter partner code for discount"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isCreatingIntent || isProcessingPayment}
        >
          {isCreatingIntent ? (
            <LoadingSpinner />
          ) : (
            "Calculate Total & Get Payment Ready"
          )}
        </button>
      </form>

      {currentPaymentIntent && (
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <p className="flex justify-between text-gray-700 mb-2">
            <span>Original Amount:</span>{" "}
            <span>${currentPaymentIntent.amount.toFixed(2)}</span>
          </p>
          {currentPaymentIntent.discount > 0 && (
            <p className="flex justify-between text-green-600 mb-2">
              <span>Discount:</span>{" "}
              <span>-${currentPaymentIntent.discount.toFixed(2)}</span>
            </p>
          )}
          <p className="flex justify-between text-gray-700 mb-2">
            <span>Subtotal:</span>{" "}
            <span>${currentPaymentIntent.final_amount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-gray-700 mb-2">
            <span>Tax ({currentPaymentIntent.tax_type}):</span>{" "}
            <span>${currentPaymentIntent.tax_amount.toFixed(2)}</span>
          </p>
          <p className="flex justify-between text-lg font-semibold text-gray-900 border-t pt-2">
            <span>Total Due:</span>{" "}
            <span>${currentPaymentIntent.total_amount.toFixed(2)}</span>
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Enter Card Details</h3>
            <div className="border border-gray-300 p-3 rounded-md mb-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": {
                        color: "#aab7c4",
                      },
                    },
                    invalid: {
                      color: "#9e2146",
                    },
                  },
                }}
              />
            </div>
            <button
              onClick={handleConfirmPayment}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? (
                <LoadingSpinner />
              ) : (
                `Confirm Payment ($${currentPaymentIntent.total_amount.toFixed(
                  2
                )})`
              )}
            </button>
          </div>
        </div>
      )}
      {intentError && (
        <ErrorMessage
          message={
            typeof intentError === "string"
              ? intentError
              : "An error occurred when creating payment intent."
          }
          onClose={() => {}}
        />
      )}
      {processError && (
        <ErrorMessage
          message={
            typeof processError === "string"
              ? processError
              : "An error occurred during payment processing."
          }
          onClose={() => {}}
        />
      )}
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const { client_name } = useParams<{ client_name: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userEmail = queryParams.get("user_email") || "default@example.com";

  if (!client_name) {
    return (
      <ErrorMessage
        message="Client name is missing for payment."
        onClose={() => {}}
      />
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Secure Payment
      </h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm clientName={client_name} userEmail={userEmail} />
      </Elements>
    </div>
  );
};

export default PaymentPage;
