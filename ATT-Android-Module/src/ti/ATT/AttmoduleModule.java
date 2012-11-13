/**
 * This file was auto-generated by the Titanium Module SDK helper for Android
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */
package ti.ATT;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.FileEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.appcelerator.kroll.KrollDict;
import org.appcelerator.kroll.KrollFunction;
import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;

import org.appcelerator.titanium.TiApplication;
import org.appcelerator.kroll.common.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Base64;

@Kroll.module(name = "Attmodule", id = "ti.api.att")
public class AttmoduleModule extends KrollModule {

	// Standard Debugging variables
	private static final String LCAT = "AttmoduleModule";
	// private static final boolean DBG = TiConfig.LOGD;
	String response = null;
	boolean isJSON = true;
	boolean isMMS = false;
	public static String content = null;

	// Constants.
	public static final String ARG_HEADER_ACCEPT = "headerAccept";
	public static final String ARG_HEADER_CONTENT_TYPE = "headerContentType";
	public static final String ARG_HEADER_CONTENT_LENGTH = "headerContentLength";
	public static final String ARG_HEADER_XSPEECH_CONTENT = "headerXSpeechContent";
	public static final String ARG_HEADER_TRANSFER_ENCODING = "headerTransferEncoding";
	public static final String VAL_TRANSFER_ENCODING_CHUNKED = "chunked";
	public static final String ARG_URL = "host";
	public static final String VAL_CONTENT_TYPE_WAV = "audio/wav";
	public static final String VAL_CONTENT_TYPE_AMR = "audio/amr";

	public static final String ERR_INV_ACT_CODE = "PLAT001";
	public static final String ERR_INV_ACT_MSG = "Invalid Action Provided";
	public static final String ARG_TOKEN = "token";
	public static final String ERR_INV_PARAM_CODE = "PLAT002";
	public static final String ERR_INV_PARAM_MSG = "Invalid Parameters Provided";
	public static final String ARG_FILEPATH = "filePath";
	public static final String ERR_INV_PROCESS_CODE = "PLAT003";
	public static final String ERR_INV_PROCESS_MSG = "Processing error occured";

	public static final String ERR_FILE_NA_CODE = "PLAT004";
	public static final String ERR_FILE_NA_MSG = "File not found";

	public static final String ERR_PROCESS_AUDIO_CODE = "PLAT005";
	public static final String ERR_PROCESS_AUDIO_MSG = "Unable to process audio file";

	public static final String ERR_INV_STATUS_CODE = "PLAT006";
	public static final String ERR_INV_STATUS_MSG = "Status Code not 200/201";

	public static final String ERR_PROCESS_REQ_CODE = "PLAT007";
	public static final String ERR_PROCESS_REQ_MSG = "Error while executing request";

	/**
	 * Constructor
	 */
	public AttmoduleModule() {
		super();
	}

	/**
	 * @method This method will be called before the application started.
	 * @param app
	 */
	@Kroll.onAppCreate
	public static void onAppCreate(TiApplication app) {
		Log.d(LCAT, "inside onAppCreate");
	}

	/**
	 * This is a generic method that is used to get the Boundary value.(Not
	 * Exposed to JavaScript)
	 * 
	 * @return boundary value.
	 */
	private static String getBoundary() {
		return "----=_Part_0_1" + Math.round((Math.random() * 10000000)) + "."
				+ new Date().getTime() * 1000;

	}

	/**
	 * @method buildBeginMoboMessage This method is used to create the request
	 *         body for MOBO API's sendMessage method.(Not Exposed to
	 *         JavaScript)
	 * @param boundary
	 *            boundary value.
	 * @param JSONbody
	 *            JSON Body value used if the contentType is JSON.
	 * @param XMLbody
	 *            String body value used id contentType is xml or url-encoded.
	 * @param fileName
	 *            name of the file that need to be send on the device.
	 * @param type
	 *            type of the file that need to be send on the device.
	 * @param filePaths
	 *            path of the file that need to be send on the device.
	 * @param contentType
	 *            contentType in which user want to send its data.
	 * @return request body
	 * @static
	 */
	private static String buildBeginMoboMessage(String boundary,
			KrollDict JSONbody, String XMLbody, String[] fileName,
			String[] type, String[] filePaths, String contentType) {
		String[] telArray = null;
		StringBuffer theReturn = new StringBuffer("--").append(boundary)
				.append("\r\n");
		theReturn.append("Content-Type: application/json; charset=UTF-8")
				.append("\r\n");
		theReturn.append("Content-ID: <start>").append("\r\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"root-fields\"")
				.append("\r\n");
		theReturn.append("\r\n");
		if (contentType.equalsIgnoreCase("application/json")) {
			if (JSONbody.containsKeyAndNotNull("Addresses")) {
				telArray = JSONbody.getStringArray("Addresses");
				JSONArray jsArray = new JSONArray();
				for (int i = 0; i < telArray.length; i++) {
					jsArray.put(telArray[i]);
				}
				JSONbody.remove("Addresses");
				JSONbody.put("Addresses", jsArray);
			}
			theReturn.append(JSONbody).append("\n");
		} else {
			theReturn.append(XMLbody).append("\n");
		}
		Log.d(LCAT, "value are " + fileName.toString() + filePaths.toString()
				+ type.toString());

		String thisLine = null;
		for (int i = 0, j = fileName.length; i < j; i++) {
			if (fileName[i] != null && filePaths[i] != null && type[i] != null) {
				System.out.println("FileName: " + fileName[i] + "\t FileType: "
						+ type[i] + "\t FilePaths: " + filePaths[i]);
				theReturn.append("\r\n--").append(boundary).append("\r\n");
				theReturn.append("Content-Type: ").append(type[i])
						.append("\r\n");
				theReturn.append("Content-ID: <").append(fileName[i])
						.append(">").append("\r\n");
				theReturn.append("Content-Transfer-Encoding: base64").append(
						"\r\n");
				theReturn.append("Content-Disposition: form-data; name=\"")
						.append(fileName[i]).append("\";filename=\"")
						.append(fileName[i]).append("\"").append("\r\n");
				theReturn.append("\r\n");
				try {
					FileInputStream mFileInputStream = new FileInputStream(
							filePaths[i]);
					ByteArrayOutputStream bos = new ByteArrayOutputStream();
					byte[] b = new byte[1024];
					int bytesRead = 0;
					while ((bytesRead = mFileInputStream.read(b)) != -1) {
						bos.write(b, 0, bytesRead);
					}

					byte[] ba = bos.toByteArray();
					thisLine = Base64.encodeToString(ba, 0);
					theReturn.append(thisLine);

				} catch (IOException e) {
					e.printStackTrace();
				}
			}

		}
		Log.d(LCAT, "Value of request  is " + (theReturn.toString()));
		return theReturn.toString();
	}

	/**
	 * @method buildBeginMMSMessage This method is used to create the request
	 *         body for MMS API's sendMMS method.(Not Exposed to JavaScript)
	 * @param boundary
	 *            boundary value.
	 * @param JSONbody
	 *            JSON Body value used if the contentType is JSON.
	 * @param XMLbody
	 *            String body value used id contentType is xml or url-encoded.
	 * @param fileName
	 *            name of the file that need to be send on the device.
	 * @param type
	 *            type of the file that need to be send on the device.
	 * @param filePaths
	 *            path of the file that need to be send on the device.
	 * @param contentType
	 *            contentType in which user want to send its data.
	 * @return request body
	 * @static
	 */

	private static String buildBeginMMSMessage(String boundary,
			KrollDict JSONbody, String XMLbody, String[] fileName,
			String[] type, String[] filePaths, String contentType) {
		StringBuffer theReturn = new StringBuffer("--").append(boundary)
				.append("\n");
		theReturn.append("Content-Type: " + contentType).append("\n");
		theReturn.append("Content-ID: <start>").append("\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"root-fields\"")
				.append("\n");
		theReturn.append("\n");
		if (contentType.equalsIgnoreCase("application/json")) {
			theReturn.append(JSONbody).append("\n");
		} else {
			theReturn.append(XMLbody).append("\n");
		}
		String thisLine = null;

		for (int i = 0, j = fileName.length; i < j; i++) {

			System.out.println("FileName: " + fileName[i] + "\t FileType: "
					+ type[i]);

			theReturn.append("\n--").append(boundary).append("\n");
			theReturn.append("Content-Type: ").append(type[i]).append("\n");
			theReturn.append("Content-ID: <").append(fileName[i]).append(">")
					.append("\n");
			theReturn.append("Content-Transfer-Encoding: base64").append("\n");
			theReturn.append("Content-Disposition: attachment; name=\"")
					.append(fileName[i]).append("\"").append("\n");
			theReturn.append("\n");

			try {
				FileInputStream mFileInputStream = new FileInputStream(
						filePaths[i]);
				ByteArrayOutputStream bos = new ByteArrayOutputStream();
				byte[] b = new byte[1024];
				int bytesRead = 0;
				while ((bytesRead = mFileInputStream.read(b)) != -1) {
					bos.write(b, 0, bytesRead);
				}
				byte[] ba = bos.toByteArray();
				thisLine = Base64.encodeToString(ba, 0);
				theReturn.append(thisLine);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}

		Log.d(LCAT, "Request value is" + theReturn.toString());
		return theReturn.toString();
	}

	/**
	 * @method buildEndMMSMessage This method used to get the value of End
	 *         Boundary Value.(Not Exposed to JavaScript)
	 * @param boundary
	 *            boundary Value.
	 * @return End Boundary Value.
	 * @static
	 */
	private static String buildEndMMSMessage(String boundary) {
		StringBuffer theReturn = new StringBuffer();
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");
		return theReturn.toString();
	}

	/**
	 * This method sends a WAP Message to the AT&T Network Device.(Not Exposed
	 * to JavaScript)
	 * 
	 * @param host
	 *            The domain name (or ip address) and port the request is
	 *            submitted to. Example https://beta-api.att.com
	 * @param accessToken
	 *            The Token representing the logged-in user
	 * @param tel
	 *            The Telephone number of the user
	 * @param xml
	 *            The message to push
	 * @return will return a JSONObject of the device location
	 * @method wapPush
	 * @static
	 */
	public static String wapPush(String host, String accessToken,
			KrollDict JSONbody, String XMLbody, String xml, String contentType,
			String accept) {
		String theReturn = null;
		URL url = null;
		String boundary = getBoundary();

		try {
			url = new URL(host);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", accessToken);
			conn.setRequestProperty("content-type", contentType);
			conn.setRequestProperty("accept", accept);
			conn.setRequestProperty("content-type",
					"multipart/form-data; type=\"" + contentType
							+ "\"; start=\"<part0Titanium>\"; boundary=\""
							+ boundary + "\"");

			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream());
			String request = buildWAPMessage(boundary, JSONbody, XMLbody, xml,
					contentType);

			wr.write(request);
			wr.flush();
			wr.close();

			StringBuffer response = new StringBuffer();

			if (conn.getResponseCode() < 400) {
				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getInputStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			} else {
				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getErrorStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			}
			theReturn = response.toString();
			Log.d(LCAT, "Response is: " + theReturn.toString());
		} catch (Exception e) {
			theReturn = e.getMessage();
		}
		return theReturn;
	}

	/**
	 * @method buildWAPMessage This method is used to construct the request body
	 *         for sendWAPPush.(Not Exposed to JavaScript)
	 * @param boundary
	 *            boundary value.
	 * @param JSONbody
	 *            JSON Body value used if the contentType is JSON.
	 * @param XMLbody
	 *            String body value used id contentType is xml or url-encoded.
	 * @param message
	 *            message that need to be send in WapPush Message.
	 * @param contentType
	 *            contentType in which user want to send its data.
	 * @return request body.
	 */
	private static String buildWAPMessage(String boundary, KrollDict JSONbody,
			String XMLbody, String message, String contentType) {
		StringBuffer theReturn = new StringBuffer("--").append(boundary)
				.append("\n");
		theReturn.append("Content-Type: " + contentType).append("\n");
		theReturn.append("Content-ID: <part0@sencha.com>").append("\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"root-fields\"")
				.append("\n");
		theReturn.append("\n");
		if (contentType.equalsIgnoreCase("application/json")) {
			theReturn.append(JSONbody).append("\n");
		} else {
			theReturn.append(XMLbody).append("\n");
		}
		theReturn.append("--").append(boundary).append("\n");
		theReturn.append("Content-Type: text/xml").append("\n");
		theReturn.append("Content-ID: <part2@sencha.com>").append("\n");
		theReturn.append("\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"PushContent\"")
				.append("\n");
		theReturn.append("Content-Type: text/vnd.wap.si").append("\n");
		theReturn.append("Content-Length: 12").append("\n");
		theReturn.append("X-Wap-Application-Id: x-wap-application:wml.ua")
				.append("\n");
		theReturn.append("\n");
		theReturn.append(message);
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");
		Log.d(LCAT, "request value is " + theReturn.toString());
		return theReturn.toString();
	}

	/**
	 * This method is a common method used to sends a MMS Message and Mobo
	 * Message(Not Exposed to javaScript)
	 * 
	 * @param host
	 *            The domain name (or ip address) and port the request is
	 *            submitted to. Example https://beta-api.att.com
	 * @param accessToken
	 *            The Token representing the logged in user
	 * @param tel
	 *            The Telephone number of the user
	 * @param fileName
	 *            The name of the file
	 * @param stream
	 *            The Stream of the data object
	 * @param fileType
	 *            type of file
	 * @return the JSON/xml result
	 * @method sendMms
	 * @static
	 */
	public static String send(String host, String accessToken,
			KrollDict JSONbody, String XMLbody, String[] fileType,
			String[] fileName, String[] filePaths, String headerAccept,
			String contentType, boolean isMMS) {
		String theReturn = null;

		URL url;
		try {
			url = new URL(host);

			String boundary = getBoundary();

			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", accessToken);
			conn.setRequestProperty("content-type", contentType);
			conn.setRequestProperty("accept", headerAccept);
			conn.setRequestProperty("content-type",
					"multipart/form-data; type=\"" + contentType
							+ "\"; start=\"<start>\"; boundary=\"" + boundary
							+ "\"");

			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream());
			if (isMMS) {
				content = buildBeginMMSMessage(boundary, JSONbody, XMLbody,
						fileName, fileType, filePaths, contentType);
			} else {
				content = buildBeginMoboMessage(boundary, JSONbody, XMLbody,
						fileName, fileType, filePaths, contentType);
			}

			wr.write(content);
			wr.write(buildEndMMSMessage(boundary));
			wr.flush();
			wr.close();

			StringBuffer response = new StringBuffer();
			if (conn.getResponseCode() < 400) {

				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getInputStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			} else {
				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getErrorStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			}

			theReturn = response.toString();
		} catch (Exception e) {

			theReturn = e.getMessage();
		}
		return theReturn;
	}

	/**
	 * @method getFile
	 * @param fileName
	 *            name of the file.
	 * @return File
	 * @throws FileNotFoundException
	 * @static
	 */
	public static File getFile(String fileName) throws FileNotFoundException {
		File file = new File(fileName);
		if (!file.exists()) {
			System.out.println("File not found, Path: "
					+ file.getAbsolutePath());

			throw new FileNotFoundException();

		} else {
			System.out.println("File Found, Path: " + file.getAbsolutePath());
		}

		return file;
	}

	/**
	 * @method prepareRequest this is a helper method used to prepare the
	 *         request body for Speech API's speechToText method.
	 * @param file
	 *            Speech file.
	 * @param url
	 *            value of url.
	 * @param chunked
	 *            boolean value to check whether the data Streamed or not
	 * @return HttpPost
	 */
	public static HttpPost prepareRequest(File file, String url, boolean chunked) {
		HttpPost post = new HttpPost(url);

		FileEntity reqEntity = new FileEntity(file, "binary/octet-stream");
		reqEntity.setContentType("binary/octet-stream");
		reqEntity.setChunked(chunked);
		post.setEntity(reqEntity);

		return post;
	}

	/**
	 * @method processResponse This method is used to process the response that
	 *         we get from the speech API.
	 * @param response
	 *            response that we get from the speech API.
	 * @return response in String.
	 * @throws Exception
	 * @static
	 */
	public static String processResponse(HttpResponse response)
			throws Exception {

		HttpEntity resEntity = response.getEntity();
		String result = EntityUtils.toString(resEntity);
		
//		int statusCode = response.getStatusLine().getStatusCode();
//
//		if (statusCode == 200 || statusCode == 201) {
//			
//		} else {
//			
//			throw new Exception(ERR_INV_STATUS_MSG);
//		}
//
//		System.out.println("jsonResponse: " + result.toString());

		return result.toString();
	}

	/**
	 * @method prepareMessage this is a helper method that is used to prepare
	 *         the message that need to send to the javaScript user.
	 * @param code
	 * @param message
	 * @return message value
	 */
	public static JSONObject prepareMessage(String code, String message) {
		JSONObject returnVal = new JSONObject();
		try {
			returnVal.put(code, message);
		} catch (JSONException e) {
			e.printStackTrace();
			System.out.println("Unable to prepare return message");
		}

		return returnVal;
	}

	/**
	 * @method speechToText this is the main method that take the parameters
	 *         sent be user and process those with helper methods and get the
	 *         response from the Speech API.and return the response in String.
	 * @param args
	 *            parameters sent by user.
	 * @return response in string
	 */
	public static String STT(Map<String, String> args) {
		File file = null;
		try {
			System.out.println("file :::: " + args.get(ARG_FILEPATH));
			file = getFile(args.get(ARG_FILEPATH));

		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return prepareMessage(ERR_FILE_NA_CODE, ERR_FILE_NA_MSG).toString();
		} catch (Exception ex) {
			ex.printStackTrace();
			return prepareMessage(ERR_PROCESS_AUDIO_CODE, ERR_PROCESS_AUDIO_MSG)
					.toString();
		}

		System.out.println("args: " + args);
		DefaultHttpClient httpclient = new DefaultHttpClient();

		boolean isChunked = false;
		String transferEncoding = args.get(ARG_HEADER_TRANSFER_ENCODING);
		if (transferEncoding != null
				&& transferEncoding
						.equalsIgnoreCase(VAL_TRANSFER_ENCODING_CHUNKED)) {
			isChunked = true;
		}

		HttpPost httppost = prepareRequest(file, args.get(ARG_URL), isChunked);

		httppost.addHeader("Authorization", args.get(ARG_TOKEN));
		if (args.containsKey(ARG_HEADER_CONTENT_TYPE)) {
			httppost.addHeader("Content-Type",
					args.get(ARG_HEADER_CONTENT_TYPE));
		}

		if (args.containsKey(ARG_HEADER_XSPEECH_CONTENT)) {
			httppost.addHeader("X-SpeechContext",
					args.get(ARG_HEADER_XSPEECH_CONTENT));
		}
		if (args.containsKey(ARG_HEADER_TRANSFER_ENCODING)) {
			httppost.addHeader("Transfer-Encoding",
					args.get(ARG_HEADER_TRANSFER_ENCODING));
		}
		if (args.containsKey(ARG_HEADER_ACCEPT)) {
			httppost.addHeader("Accept", args.get(ARG_HEADER_ACCEPT));
		}
		String result = null;
		try {
			result = processResponse(httpclient.execute(httppost));
			System.out.println("result : " + result);
		} catch (Exception e) {
			e.printStackTrace();
			String message = null;
			String code = null;
			if (e.equals(ERR_INV_STATUS_MSG)) {
				code = ERR_INV_STATUS_CODE;
				message = ERR_INV_STATUS_MSG;
			} else {
				code = ERR_PROCESS_REQ_CODE;
				message = ERR_PROCESS_REQ_MSG;
			}
			return prepareMessage(code, message).toString();
		} finally {
			args.clear();
			args = null;
		}

		return result;
	}

	/**
	 * @method speechToText This is the speechToText method of Speech API that
	 *         is Exposed to the Titanium application developer.It will get the
	 *         arguments sent by js user as an array of object and after
	 *         processing respond back to the js user with a json object.
	 * @param arguments
	 *            arguments sent by the javascript user.
	 */
	@Kroll.method
	public void speechToText(Object[] arguments) {

		HashMap<String, String> hm = (HashMap<String, String>) arguments[0];
		String accept = hm.get(ARG_HEADER_ACCEPT);
		if (accept.equalsIgnoreCase("application/xml")) {
			isJSON = false;
		}
		KrollFunction successCallback = (KrollFunction) arguments[1];
		KrollFunction errorCallback = (KrollFunction) arguments[2];
		response = STT(hm);
		Log.d(LCAT, "response is " + response);

		if (response != null) {
			KrollDict kd = null;
			if (isJSON) {
				JSONObject resp = null;
				try {
					resp = new JSONObject(response);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LCAT, "Exception Occured" + e.toString());
				}
				try {
					kd = new KrollDict(resp);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LCAT, "Exception Occured" + e.toString());
				}
			} else {
				kd = new KrollDict();
				kd.put("success", response);
			}
			successCallback.call(getKrollObject(), kd);
		} else {
			KrollDict kdError = new KrollDict();
			kdError.put("Error", "Error while executing request");
			errorCallback.call(getKrollObject(), kdError);
		}
	}

	/**
	 * @method sendMMS This is the sendMMS method of MMS API that is Exposed to
	 *         the Titanium application developer.It will get the arguments sent
	 *         by js user as an array of object and after processing respond
	 *         back to the js user with a json object.
	 * @param arguments
	 *            arguments sent by the javascript user.
	 */
	@Kroll.method
	public void sendMMS(Object[] arguments) {
		isMMS = true;
		KrollDict JSONbody = null;
		String XMLbody = null;
		HashMap<String, Object> hm = (HashMap<String, Object>) arguments[0];
		KrollFunction successCallback = (KrollFunction) arguments[1];
		KrollFunction errorCallback = (KrollFunction) arguments[2];
		KrollDict args = new KrollDict(hm);
		String url = args.getString("url");
		String contentType = args.getString("contentType");
		try {
			if (contentType.equalsIgnoreCase("application/json")) {
				JSONbody = args.getKrollDict("body");
			} else {
				XMLbody = args.getString("body");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		String accept = args.getString("accept");
		if (accept.equalsIgnoreCase("application/xml")) {
			isJSON = false;
		}
		String[] fileNameArray = null;
		String[] fileTypeArray = null;
		String[] filePathArray = null;
		String accessToken = args.getString("accessToken");

		Object data2 = args.get("attachments");
		Object[] anArray = (Object[]) data2;
		fileNameArray = new String[anArray.length];
		fileTypeArray = new String[anArray.length];
		filePathArray = new String[anArray.length];
		for (int i = 0; i < anArray.length; i++) {
			HashMap hm1 = (HashMap) anArray[i];
			KrollDict kdAttachments = new KrollDict(hm1);
			fileNameArray[i] = kdAttachments.getString("fileName");
			fileTypeArray[i] = kdAttachments.getString("fileType");
			filePathArray[i] = kdAttachments.getString("filePath");
		}

		response = send(url, accessToken, JSONbody, XMLbody, fileTypeArray,
				fileNameArray, filePathArray, accept, contentType, isMMS);
		Log.d(LCAT, "response is " + response);
		if (response != null) {
			KrollDict kd = null;
			if (isJSON) {
				JSONObject resp = null;
				try {
					resp = new JSONObject(response);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LCAT, "Exception Occured" + e.toString());
				}
				try {
					kd = new KrollDict(resp);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LCAT, "Exception Occured" + e.toString());
				}
			} else {
				kd = new KrollDict();
				kd.put("success", response);
			}
			successCallback.call(getKrollObject(), kd);
		} else {
			KrollDict kdError = new KrollDict();
			kdError.put("Error", "Error while executing request");
			errorCallback.call(getKrollObject(), kdError);
		}

	}

	/**
	 * @method sendMessage This is the sendMessage method of MOBO API that is
	 *         Exposed to the Titanium application developer.It will get the
	 *         arguments sent by js user as an array of object and after
	 *         processing respond back to the js user with a json object.
	 * @param arguments
	 *            arguments sent by the javascript user.
	 */
	@Kroll.method
	public void sendMessage(Object[] arguments) {
		isMMS = false;
		KrollDict JSONbody = null;
		String XMLbody = null;
		HashMap<String, Object> hm = (HashMap<String, Object>) arguments[0];
		KrollFunction successCallback = (KrollFunction) arguments[1];
		KrollFunction errorCallback = (KrollFunction) arguments[2];
		KrollDict args = new KrollDict(hm);
		String url = args.getString("url");
		String contentType = args.getString("contentType");
		try {
			if (contentType.equalsIgnoreCase("application/json")) {
				JSONbody = args.getKrollDict("body");
			} else {
				XMLbody = args.getString("body");
			}
		} catch (Exception e) {
			e.printStackTrace();
			Log.d(LCAT, "Exception Occured" + e.toString());
		}
		String accept = args.getString("accept");
		if (accept.equalsIgnoreCase("application/xml")) {
			isJSON = false;
		}

		String accessToken = args.getString("accessToken");
		String[] fileNameArray = null;
		String[] fileTypeArray = null;
		String[] filePathArray = null;
		if (args.containsKeyAndNotNull("attachments")) {
			Object data2 = args.get("attachments");
			Object[] anArray = (Object[]) data2;
			fileNameArray = new String[anArray.length];
			fileTypeArray = new String[anArray.length];
			filePathArray = new String[anArray.length];
			for (int i = 0; i < anArray.length; i++) {
				HashMap hm1 = (HashMap) anArray[i];
				KrollDict kdAttachments = new KrollDict(hm1);
				fileNameArray[i] = kdAttachments.getString("fileName");
				fileTypeArray[i] = kdAttachments.getString("fileType");
				filePathArray[i] = kdAttachments.getString("filePath");
			}
		}
		response = send(url, accessToken, JSONbody, XMLbody, fileTypeArray,
				fileNameArray, filePathArray, accept, contentType, isMMS);
		Log.d(LCAT, "response is " + response);

		if (response != null) {
			KrollDict kd = null;
			if (isJSON) {
				JSONObject resp = null;
				try {
					resp = new JSONObject(response);
				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LCAT, "Exception Occured" + e.toString());
				}
				try {
					kd = new KrollDict(resp);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
					Log.d(LCAT, "Exception Occured" + e.toString());
				}
			} else {
				kd = new KrollDict();
				kd.put("success", response);
			}
			successCallback.call(getKrollObject(), kd);
		} else {
			KrollDict kdError = new KrollDict();
			kdError.put("Error", "Error while executing request");
			errorCallback.call(getKrollObject(), kdError);
		}

	}

	/**
	 * @method sendWapPush This is the sendWapPush method of WAPPush API that is
	 *         Exposed to the Titanium application developer.It will get the
	 *         arguments sent by js user as an array of object and after
	 *         processing respond back to the js user with a json object.
	 * @param arguments
	 *            arguments sent by the javascript user.
	 */
	@Kroll.method
	public void sendWapPush(Object[] arguments) {
		KrollDict JSONbody = null;
		String XMLbody = null;
		HashMap<String, Object> hm = (HashMap<String, Object>) arguments[0];
		KrollFunction successCallback = (KrollFunction) arguments[1];
		KrollFunction errorCallback = (KrollFunction) arguments[2];
		KrollDict args = new KrollDict(hm);
		String host = args.getString("url");
		String accessToken = args.getString("accessToken");
		String xml = args.getString("data");
		String contentType = args.getString("contentType");
		try {
			if (contentType.equalsIgnoreCase("application/json")) {
				JSONbody = args.getKrollDict("body");
			} else {
				XMLbody = args.getString("body");
			}
		} catch (Exception e) {
			e.printStackTrace();
			Log.d(LCAT, "Exception Occured" + e.toString());
		}
		String accept = args.getString("accept");
		if (accept.equalsIgnoreCase("application/xml")) {
			isJSON = false;
		}
		String response = wapPush(host, accessToken, JSONbody, XMLbody, xml,
				contentType, accept);
		Log.d(LCAT, "response is " + response);

		if (response != null) {
			KrollDict kd = null;
			if (isJSON) {
				JSONObject resp = null;
				try {
					resp = new JSONObject(response);
				} catch (JSONException e) {
					e.printStackTrace();
				}
				try {
					kd = new KrollDict(resp);
				} catch (Exception e) {
					e.printStackTrace();
				}
			} else {
				kd = new KrollDict();
				kd.put("success", response);
			}
			successCallback.call(getKrollObject(), kd);
		} else {
			KrollDict kdError = new KrollDict();
			kdError.put("Error", "Error while executing request");
			errorCallback.call(getKrollObject(), kdError);
		}
	}

}
