defmodule ServerWeb.UserSocket do
  use Phoenix.Socket

  require Logger

  channel "editor:*", ServerWeb.EditorChannel

  @impl true
  def connect(params, socket, connect_info) do
    Logger.debug("Socket connect attempted: #{inspect(params)}")
    Logger.debug("Connect info: #{inspect(connect_info)}")
    {:ok, assign(socket, :client_id, params["client_id"])}
  end

  @impl true
  def id(_socket) do
    nil
  end
end
