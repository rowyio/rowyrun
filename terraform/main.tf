resource "random_integer" "number" {
  min = 100
  max = 999
}
data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}
output "owner_email" {
  value       = google_cloud_run_service.rowy_backend.metadata[0].annotations["serving.knative.dev/creator"]
  description = "Owner Email"
}
