
resource "google_app_engine_application" "firestore" {
  project = var.project_id
  database_type = "CLOUD_FIRESTORE"
  location_id = "us-west1"
}
