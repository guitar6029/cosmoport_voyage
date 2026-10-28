import { ref, type Ref } from "vue";

type SignUp = { create: (input: { emailAddress: string; password: string }) => Promise<void>; prepareEmailAddressVerification: (input: { strategy: "email_code" }) => Promise<void>; attemptEmailAddressVerification: (input: { code: string }) => Promise<{ status: string; createdSessionId: string | null }> };

export function usePassportOfficeRegistration(signUp: Ref<SignUp | null>, setActive: Ref<((input: { session: string }) => Promise<void>) | undefined>, isLoaded: Ref<boolean>, complete: () => void) {
  const verifying = ref(false); const pending = ref(false); const error = ref("");
  const message = (value: unknown) => (value as { errors?: { longMessage?: string }[] })?.errors?.[0]?.longMessage || "We couldn't complete that step. Please try again.";
  async function begin(email: string, password: string) { if (!isLoaded.value || !signUp.value || pending.value) return; pending.value = true; error.value = ""; try { await signUp.value.create({ emailAddress: email.trim(), password }); await signUp.value.prepareEmailAddressVerification({ strategy: "email_code" }); verifying.value = true; } catch (value) { error.value = message(value); } finally { pending.value = false; } }
  async function verify(code: string) { if (!isLoaded.value || !signUp.value || pending.value) return; pending.value = true; error.value = ""; try { const attempt = await signUp.value.attemptEmailAddressVerification({ code: code.trim() }); const activate = setActive.value; if (attempt.status !== "complete" || !attempt.createdSessionId || !activate) { error.value = "Your session needs another step. Please try again."; return; } await activate({ session: attempt.createdSessionId }); complete(); } catch (value) { error.value = message(value); } finally { pending.value = false; } }
  async function resend() { if (!signUp.value || pending.value) return; pending.value = true; error.value = ""; try { await signUp.value.prepareEmailAddressVerification({ strategy: "email_code" }); } catch (value) { error.value = message(value); } finally { pending.value = false; } }
  return { verifying, pending, error, begin, verify, resend };
}
