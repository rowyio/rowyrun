
resource "google_app_engine_application" "firestore" {
  project = var.project
  database_type = "CLOUD_FIRESTORE"
  location_id = var.region
}
