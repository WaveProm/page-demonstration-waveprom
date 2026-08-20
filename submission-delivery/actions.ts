"use server";

import { type ActionState, handleFormAction } from "./adapters/next-action";
import { contactService } from "./config/composition-root";
import type { ContactValues } from "./config/form-schema";

export const submitContactForm = async (
  _state: ActionState<ContactValues>,
  formData: FormData,
): Promise<ActionState<ContactValues>> =>
  handleFormAction(contactService(), formData);
