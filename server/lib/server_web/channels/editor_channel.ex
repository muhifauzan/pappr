defmodule ServerWeb.EditorChannel do
  use ServerWeb, :channel

  alias Server.EditorServer

  require Logger

  @impl true
  def join("editor:main", params, socket) do
    Logger.debug("Client joining editor channel: #{inspect(params)}")
    {:ok, socket}
  end

  @impl true
  def handle_in("get_steps", %{"version" => version}, socket) do
    {:reply, get_steps(version), socket}
  end

  @impl true
  def handle_in(
        "submit_steps",
        %{"steps" => steps, "version" => version, "client_id" => client_id},
        socket
      ) do
    case EditorServer.apply_steps(steps, version, client_id) do
      {:ok, steps_state} ->
        broadcast_from!(socket, "new_steps", steps_state)
        {:reply, :ok, socket}

      {:error, reason} ->
        {:reply, {:error, reason}, socket}
    end
  end

  ## Privates

  defp get_steps(version) do
    case EditorServer.get_steps_since(version) do
      :ok ->
        :ok

      {:ok, steps_state} ->
        {:ok, steps_state}

      {:error, :version_mismatch = reason} ->
        {:error, %{reason: reason}}
    end
  end
end
