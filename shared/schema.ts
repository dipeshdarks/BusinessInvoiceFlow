import { pgTable, text, serial, integer, decimal, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  invoiceDate: text("invoice_date").notNull(),
  dueDate: text("due_date").notNull(),
  
  // Business details
  businessLegalName: text("business_legal_name").notNull(),
  businessDisplayName: text("business_display_name"),
  businessAddress: text("business_address").notNull(),
  businessPhone: text("business_phone"),
  businessEmail: text("business_email").notNull(),
  
  // Banking information
  bankName: text("bank_name").notNull(),
  accountHolder: text("account_holder").notNull(),
  accountNumber: text("account_number").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  
  // Client information
  clientCompanyName: text("client_company_name").notNull(),
  clientContactPerson: text("client_contact_person"),
  clientAddress: text("client_address").notNull(),
  clientEmail: text("client_email"),
  clientPhone: text("client_phone"),
  
  // Invoice details
  items: json("items").$type<InvoiceItem[]>().notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxRate: decimal("tax_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  taxAmount: decimal("tax_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  
  // Additional information
  notes: text("notes"),
  paymentTerms: text("payment_terms").notNull().default("net30"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
