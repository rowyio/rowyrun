// create a new service account for rowy hooks
resource "google_service_account" "rowy_builder_serviceAccount" {
  // random account id
  account_id   = "rowy-builder"
  display_name = "Rowy Builder Service Account"
}